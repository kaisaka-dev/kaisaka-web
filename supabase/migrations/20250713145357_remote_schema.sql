

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "account";


ALTER SCHEMA "account" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."actions" AS ENUM (
    'create',
    'retrieve',
    'update',
    'delete'
);


ALTER TYPE "public"."actions" OWNER TO "postgres";


COMMENT ON TYPE "public"."actions" IS 'Actions that can be done a database';



CREATE TYPE "public"."comp_status" AS ENUM (
    'planned',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."comp_status" OWNER TO "postgres";


CREATE TYPE "public"."completion_status_enum" AS ENUM (
    'planned',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."completion_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."education_type_enum" AS ENUM (
    'Home Program',
    'Nonformal',
    'Integrated/SNED',
    'Inclusive/Gen. Ed.'
);


ALTER TYPE "public"."education_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."employment_type_enum" AS ENUM (
    'Wage Employed',
    'Self-Employed',
    'Sheltered Workshop'
);


ALTER TYPE "public"."employment_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."improvement_status_enum" AS ENUM (
    'Improved',
    'Neutral',
    'Regressed'
);


ALTER TYPE "public"."improvement_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."intervention_type" AS ENUM (
    'education',
    'social'
);


ALTER TYPE "public"."intervention_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."intervention_type" IS 'Type of intervention to perform on a child';



CREATE TYPE "public"."part_type" AS ENUM (
    'caregiver',
    'child'
);


ALTER TYPE "public"."part_type" OWNER TO "postgres";


CREATE TYPE "public"."participant_type_enum" AS ENUM (
    'caregiver',
    'child'
);


ALTER TYPE "public"."participant_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."resources" AS ENUM (
    'activity',
    'addresses',
    'annual_program',
    'attendance_log',
    'barangays',
    'caregiver_groups',
    'caregivers',
    'children',
    'cities',
    'communit_group_type',
    'disability_category',
    'education_status',
    'families',
    'family_members',
    'income_type',
    'intervention',
    'intervention_history',
    'major_target_activity',
    'members',
    'membership_annual_renewal',
    'membership_payment',
    'philhealth_ids',
    'pwd_ids',
    'relationship_cc',
    'service_category',
    'service_objective',
    'sessions',
    'social_protection_status',
    'streets',
    'users',
    'roles',
    'role_permissions',
    'permissions',
    'user_roles'
);


ALTER TYPE "public"."resources" OWNER TO "postgres";


COMMENT ON TYPE "public"."resources" IS 'Tables in database';



CREATE TYPE "public"."sex_enum" AS ENUM (
    'Male',
    'Female',
    'Other'
);


ALTER TYPE "public"."sex_enum" OWNER TO "postgres";


CREATE TYPE "public"."student_status_enum" AS ENUM (
    'past_student',
    'new_student',
    'dropped_out',
    'completed'
);


ALTER TYPE "public"."student_status_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "account"."get_user_permissions"("user_uuid" "uuid" DEFAULT "auth"."uid"()) RETURNS TABLE("permission_name" "text", "slug" "text", "resource" "text", "action" "text", "granted" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    RETURN QUERY
  
    SELECT DISTINCT
      p.name AS permission_name,
      r.slug AS slug,
      p.resource AS resource,
      p.action AS action,
      rp.granted AS granted
    FROM account.permissions p
    JOIN account.role_permissions rp ON p.id = rp.permission_id
    JOIN account.roles r ON rp.role_id = r.id
    JOIN account.user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = user_uuid
    AND ur.is_active = true;
  END;
$$;


ALTER FUNCTION "account"."get_user_permissions"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "account"."get_user_roles"("user_uuid" "uuid" DEFAULT "auth"."uid"()) RETURNS TABLE("role_id" "uuid", "role_name" "text", "role_slug" "text", "role_level" integer, "assigned_at" timestamp with time zone, "expires_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    RETURN query
      SELECT 
        r.id AS role_id,
        r.name AS role_name,
        r.slug AS role_slug,
        r.level AS role_level
      FROM account.roles r
      JOIN account.user_roles ON r.id = ur.role_id
      WHERE ur.user_id = user_uuid
        AND ur.is_active = TRUE
        AND r.is_active = TRUE
      ORDER BY r.level DESC;
  END;
$$;


ALTER FUNCTION "account"."get_user_roles"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "account"."user_has_permission"("user_uuid" "uuid" DEFAULT "auth"."uid"(), "permission_name" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
  DECLARE
    has_permission BOOLEAN := false;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM account.get_user_permissions(user_uuid)
      WHERE permission_name = $2 AND granted = true
    ) INTO has_permission;
  
  RETURN has_permission;
  END;
$_$;


ALTER FUNCTION "account"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  DECLARE
    default_role_id UUID;
    user_username TEXT;
  BEGIN
    -- Get the 'User' role ID
    SELECT id INTO default_role_id 
    FROM public.roles 
    WHERE name = 'User' 
    LIMIT 1;
    
    RAISE NOTICE 'New user created: %', NEW.email;
    RAISE NOTICE 'Raw user metadata: %', NEW.raw_user_meta_data;
    RAISE NOTICE 'Raw app metadata: %', NEW.raw_app_meta_data;
    
    -- Extract username with fallback
    user_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        split_part(NEW.email, '@', 1)
    );
    
    RAISE NOTICE 'Extracted username: %', user_username;
    
    -- Validate username is not null or empty
    IF user_username IS NULL OR user_username = '' THEN
        RAISE EXCEPTION 'Username cannot be null or empty for user: %', NEW.email;
    END IF;

    -- Insert into user_profiles
    INSERT INTO public.user_profiles (user_id, email, username, is_active)
    VALUES (
      NEW.id, 
      NEW.email, 
      user_username,
      true
    );
    
    RAISE NOTICE 'User profile created successfully for: %', NEW.email;

    -- Insert into user_roles with default 'User' role
    IF default_role_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES (NEW.id, default_role_id);
      RAISE NOTICE 'User role assigned successfully for: %', NEW.email;
    ELSE
      RAISE WARNING 'No default User role found - user % will have no roles', NEW.email;
    END IF;

    RETURN NEW;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Error in handle_new_user function: %', SQLERRM;
  END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_permission"("permission_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM account.user_roles ur
      JOIN account.role_permissions rp on ur.role_id = rp.role_id
      JOIN account.permissions ON rp.role_id = p.id
      WHERE ur.user_id = auth.uid() AND p.name = permission_name 
    );
  END;

$$;


ALTER FUNCTION "public"."user_has_permission"("permission_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_permission"("user_uuid" "uuid" DEFAULT "auth"."uid"(), "permission_name" "text" DEFAULT NULL::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
  DECLARE
    has_permission BOOLEAN := false;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM account.get_user_permissions(user_uuid)
      WHERE permission_name = $2 AND granted = true
    ) INTO has_permission;
  
  RETURN has_permission;
  END;
$_$;


ALTER FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "account"."users" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "enable" boolean DEFAULT false NOT NULL,
    "username" "text" NOT NULL,
    "password_hash" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email_verified_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_login_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "is_verified" boolean DEFAULT false NOT NULL,
    "is_suspended" boolean DEFAULT false NOT NULL
);


ALTER TABLE "account"."users" OWNER TO "postgres";


COMMENT ON TABLE "account"."users" IS 'Users registered using the website';



CREATE TABLE IF NOT EXISTS "public"."activity" (
    "id" bigint NOT NULL,
    "target_activity_id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "type" character varying NOT NULL,
    "date_and_time_conducted" timestamp with time zone DEFAULT "now"() NOT NULL,
    "indicators" "text",
    "outcome" "text",
    "remarks" "text",
    "date_and_time_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date_and_time_last_updated" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completion_status" "public"."completion_status_enum"
);


ALTER TABLE "public"."activity" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."activity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."activity_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."activity_id_seq" OWNED BY "public"."activity"."id";



CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "barangay_id" integer NOT NULL,
    "address" character varying NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


COMMENT ON TABLE "public"."addresses" IS 'Addresses of members';



CREATE TABLE IF NOT EXISTS "public"."annual_program" (
    "id" bigint NOT NULL,
    "start_year" smallint NOT NULL,
    "start_month" smallint,
    "start_date" smallint,
    "end_year" smallint NOT NULL,
    "end_month" smallint,
    "end_date" smallint,
    "target_new_cwds" smallint NOT NULL,
    "general_reflection" "text",
    "lessons_learned" "text",
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."annual_program" OWNER TO "postgres";


COMMENT ON TABLE "public"."annual_program" IS 'Accomplished reports of programs in kaisaka';



ALTER TABLE "public"."annual_program" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."annual_program_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."attendance_log" (
    "id" bigint NOT NULL,
    "participant_id" "uuid" NOT NULL,
    "conducted_activity_id" bigint NOT NULL,
    "individual_intervention_plan" boolean DEFAULT false,
    "transition_graduation_plan" boolean DEFAULT false,
    "remarks" "text",
    "is_late" boolean DEFAULT false NOT NULL,
    "participant_type" "public"."participant_type_enum"
);


ALTER TABLE "public"."attendance_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."attendance_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."attendance_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."attendance_log_id_seq" OWNED BY "public"."attendance_log"."id";



CREATE TABLE IF NOT EXISTS "public"."barangays" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "num" character varying,
    "city_id" smallint
);


ALTER TABLE "public"."barangays" OWNER TO "postgres";


COMMENT ON TABLE "public"."barangays" IS 'Barangay locations';



ALTER TABLE "public"."barangays" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."barangays_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."caregiver_groups" (
    "id" bigint NOT NULL,
    "date_joined" "date" DEFAULT "now"() NOT NULL,
    "community_group_id" bigint NOT NULL,
    "date_left" "date",
    "caregiver_id" "uuid" NOT NULL
);


ALTER TABLE "public"."caregiver_groups" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."caregiver_groups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."caregiver_groups_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."caregiver_groups_id_seq" OWNED BY "public"."caregiver_groups"."id";



CREATE TABLE IF NOT EXISTS "public"."caregivers" (
    "contact_number" character varying NOT NULL,
    "facebook_link" character varying,
    "email" character varying,
    "occupation" character varying,
    "member_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "income_id" bigint
);


ALTER TABLE "public"."caregivers" OWNER TO "postgres";


COMMENT ON TABLE "public"."caregivers" IS 'Recognized caregivers of kaisaka';



CREATE TABLE IF NOT EXISTS "public"."children" (
    "has_philhealth" boolean DEFAULT false NOT NULL,
    "has_birth_cert" boolean DEFAULT false NOT NULL,
    "has_medical_cert" boolean DEFAULT false NOT NULL,
    "has_barangay_cert" boolean DEFAULT false NOT NULL,
    "remarks" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "member_id" "uuid" DEFAULT "gen_random_uuid"(),
    "pwd_id" "uuid" DEFAULT "gen_random_uuid"(),
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "disability_id" bigint,
    "disability_nature" "text",
    "has_vote" boolean DEFAULT false NOT NULL,
    "has_national_id" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."children" OWNER TO "postgres";


COMMENT ON TABLE "public"."children" IS 'Children of Kaisaka';



CREATE TABLE IF NOT EXISTS "public"."cities" (
    "id" smallint NOT NULL,
    "city_name" character varying NOT NULL
);


ALTER TABLE "public"."cities" OWNER TO "postgres";


COMMENT ON TABLE "public"."cities" IS 'Cities within the Philippines';



CREATE SEQUENCE IF NOT EXISTS "public"."cities_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."cities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cities_id_seq" OWNED BY "public"."cities"."id";



ALTER TABLE "public"."cities" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cities_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."community_group_type" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."community_group_type" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."community_group_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."community_group_type_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."community_group_type_id_seq" OWNED BY "public"."community_group_type"."id";



CREATE TABLE IF NOT EXISTS "public"."disability_category" (
    "id" bigint NOT NULL,
    "name" character varying
);


ALTER TABLE "public"."disability_category" OWNER TO "postgres";


COMMENT ON TABLE "public"."disability_category" IS 'Known disabilities of certain people';



ALTER TABLE "public"."disability_category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."disabilities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."education_status" (
    "id" bigint NOT NULL,
    "education_type" "public"."education_type_enum",
    "year_start" smallint NOT NULL,
    "year_end" smallint,
    "grade_level" character varying,
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_updated" timestamp with time zone NOT NULL,
    "child_id" "uuid" DEFAULT "gen_random_uuid"(),
    "student_status_type" "public"."student_status_enum"
);


ALTER TABLE "public"."education_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."education_status" IS 'Highest education level achieved by children';



ALTER TABLE "public"."education_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."education_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."employment_status" (
    "id" bigint NOT NULL,
    "able_to_work" boolean DEFAULT false NOT NULL,
    "employment_type" "public"."employment_type_enum",
    "member_id" "uuid" NOT NULL
);


ALTER TABLE "public"."employment_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."employment_status" IS 'Job occupation of a member';



ALTER TABLE "public"."employment_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."employment_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."families" (
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."families" OWNER TO "postgres";


COMMENT ON TABLE "public"."families" IS 'Family groups';



CREATE TABLE IF NOT EXISTS "public"."family_members" (
    "is_child" boolean NOT NULL,
    "relationship_type" character varying,
    "date_added" timestamp with time zone DEFAULT "now"() NOT NULL,
    "member_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "family_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."family_members" OWNER TO "postgres";


COMMENT ON TABLE "public"."family_members" IS 'Members of a family group';



CREATE TABLE IF NOT EXISTS "public"."income_type" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."income_type" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."income_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."income_type_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."income_type_id_seq" OWNED BY "public"."income_type"."id";



CREATE TABLE IF NOT EXISTS "public"."intervention" (
    "service_category_id" bigint NOT NULL,
    "intervention" "text" NOT NULL,
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_updated" timestamp with time zone NOT NULL,
    "status" "public"."improvement_status_enum" NOT NULL,
    "remarks" "text",
    "child_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."intervention" OWNER TO "postgres";


COMMENT ON TABLE "public"."intervention" IS 'Intervention requirements of children';



CREATE TABLE IF NOT EXISTS "public"."intervention_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "intervention_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date_checked" "date" DEFAULT "now"() NOT NULL,
    "improvement" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."improvement_status_enum" NOT NULL,
    "remarks" "text"
);


ALTER TABLE "public"."intervention_history" OWNER TO "postgres";


COMMENT ON TABLE "public"."intervention_history" IS 'The history of each intervention per child';



CREATE TABLE IF NOT EXISTS "public"."major_target_activity" (
    "id" bigint NOT NULL,
    "service_objective_id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "type" character varying NOT NULL,
    "target_no_of_participants" smallint NOT NULL,
    "remarks" "text",
    "date_and_time_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date_and_time_last_updated" timestamp with time zone NOT NULL
);


ALTER TABLE "public"."major_target_activity" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."major_target_activity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."major_target_activity_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."major_target_activity_id_seq" OWNED BY "public"."major_target_activity"."id";



CREATE TABLE IF NOT EXISTS "public"."members" (
    "first_name" character varying NOT NULL,
    "middle_name" character varying,
    "last_name" character varying NOT NULL,
    "birthday" "date",
    "sex" "public"."sex_enum" NOT NULL,
    "admission_date" timestamp with time zone,
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_updated" timestamp with time zone,
    "last_approved" timestamp with time zone,
    "address_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."members" OWNER TO "postgres";


COMMENT ON TABLE "public"."members" IS 'Members of Kaiasaka';



CREATE TABLE IF NOT EXISTS "public"."membership_annual_renewal" (
    "id" bigint NOT NULL,
    "annual_program_id" bigint NOT NULL,
    "total_amount_due" numeric(10,2) NOT NULL,
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_updated" timestamp with time zone DEFAULT "now"() NOT NULL,
    "remarks" "text",
    "family_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."membership_annual_renewal" OWNER TO "postgres";


COMMENT ON TABLE "public"."membership_annual_renewal" IS 'Annual Renewal Payment of members';



ALTER TABLE "public"."membership_annual_renewal" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."membership_annual_renewal_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."membership_payment" (
    "annual_program_id" bigint NOT NULL,
    "amount_paid" numeric(10,2),
    "date_paid" "date",
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "remarks" "text",
    "family_id" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."membership_payment" OWNER TO "postgres";


COMMENT ON TABLE "public"."membership_payment" IS 'Payment of members';



CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "is_system" boolean DEFAULT false NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "resource" "public"."resources" NOT NULL,
    "action" "public"."actions" NOT NULL
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pwd_ids" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expiry_date" "date" NOT NULL,
    "pwd_id" character varying NOT NULL
);


ALTER TABLE "public"."pwd_ids" OWNER TO "postgres";


COMMENT ON TABLE "public"."pwd_ids" IS 'Person with disabilities';



CREATE TABLE IF NOT EXISTS "public"."relationship_cc" (
    "relationship" character varying,
    "caregiver" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "child" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."relationship_cc" OWNER TO "postgres";


COMMENT ON TABLE "public"."relationship_cc" IS 'Relatioship of caregiver and child';



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "role_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "permission_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "granted" boolean NOT NULL,
    "is_system" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_permissions" IS 'Assigned Permissions to a Role';



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "level" smallint DEFAULT '0'::smallint NOT NULL,
    "is_system" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles" IS 'Names';



CREATE TABLE IF NOT EXISTS "public"."service_category" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."service_category" OWNER TO "postgres";


COMMENT ON TABLE "public"."service_category" IS 'Services that are accessible to children for intervention';



ALTER TABLE "public"."service_category" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."service_category_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."service_objective" (
    "id" bigint NOT NULL,
    "annual_program_id" bigint NOT NULL,
    "service_category_id" bigint NOT NULL,
    "objective_description" "text" NOT NULL
);


ALTER TABLE "public"."service_objective" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."service_objective_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."service_objective_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."service_objective_id_seq" OWNED BY "public"."service_objective"."id";



CREATE TABLE IF NOT EXISTS "public"."social_protection_status" (
    "id" bigint NOT NULL,
    "fam_year_accessed" integer,
    "date_created" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_updated" timestamp with time zone,
    "child_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "participates_family_life" boolean DEFAULT false,
    "participates_community_club" boolean DEFAULT false,
    "comm_year_accessed" integer
);


ALTER TABLE "public"."social_protection_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."social_protection_status" IS 'Protection status of children';



ALTER TABLE "public"."social_protection_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."social_protection_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "user_id" "uuid" NOT NULL,
    "email" character varying(255) NOT NULL,
    "username" character varying(50) NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_roles" IS 'Users and Roles';



ALTER TABLE ONLY "public"."activity" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."activity_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."attendance_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."attendance_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."caregiver_groups" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."caregiver_groups_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."community_group_type" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."community_group_type_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."income_type" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."income_type_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."major_target_activity" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."major_target_activity_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."service_objective" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."service_objective_id_seq"'::"regclass");



ALTER TABLE ONLY "account"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "account"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "account"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."activity"
    ADD CONSTRAINT "activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activity"
    ADD CONSTRAINT "activity_target_activity_id_key" UNIQUE ("target_activity_id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."annual_program"
    ADD CONSTRAINT "annual_program_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."annual_program"
    ADD CONSTRAINT "annual_program_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance_log"
    ADD CONSTRAINT "attendance_log_conducted_activity_id_key" UNIQUE ("conducted_activity_id");



ALTER TABLE ONLY "public"."attendance_log"
    ADD CONSTRAINT "attendance_log_participant_id_key" UNIQUE ("participant_id");



ALTER TABLE ONLY "public"."attendance_log"
    ADD CONSTRAINT "attendance_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."barangays"
    ADD CONSTRAINT "barangays_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."barangays"
    ADD CONSTRAINT "barangays_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."caregiver_groups"
    ADD CONSTRAINT "caregiver_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."caregivers"
    ADD CONSTRAINT "caregivers_income_id_key" UNIQUE ("income_id");



ALTER TABLE ONLY "public"."caregivers"
    ADD CONSTRAINT "caregivers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."children"
    ADD CONSTRAINT "children_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_city_name_key" UNIQUE ("city_name");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."cities"
    ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_group_type"
    ADD CONSTRAINT "community_group_type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."disability_category"
    ADD CONSTRAINT "disabilities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."education_status"
    ADD CONSTRAINT "education_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employment_status"
    ADD CONSTRAINT "employment_status_child_id_key" UNIQUE ("member_id");



ALTER TABLE ONLY "public"."employment_status"
    ADD CONSTRAINT "employment_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."families"
    ADD CONSTRAINT "families_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."family_members"
    ADD CONSTRAINT "family_members_pkey" PRIMARY KEY ("member_id", "family_id");



ALTER TABLE ONLY "public"."income_type"
    ADD CONSTRAINT "income_type_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."income_type"
    ADD CONSTRAINT "income_type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."intervention"
    ADD CONSTRAINT "intervention_child_id_key" UNIQUE ("child_id");



ALTER TABLE ONLY "public"."intervention"
    ADD CONSTRAINT "intervention_date_created_key" UNIQUE ("date_created");



ALTER TABLE ONLY "public"."intervention_history"
    ADD CONSTRAINT "intervention_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."intervention"
    ADD CONSTRAINT "intervention_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."intervention"
    ADD CONSTRAINT "intervention_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."intervention"
    ADD CONSTRAINT "intervention_service_category_id_key" UNIQUE ("service_category_id");



ALTER TABLE ONLY "public"."major_target_activity"
    ADD CONSTRAINT "major_target_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."major_target_activity"
    ADD CONSTRAINT "major_target_activity_service_objective_id_key" UNIQUE ("service_objective_id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."membership_annual_renewal"
    ADD CONSTRAINT "membership_annual_renewal_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."membership_payment"
    ADD CONSTRAINT "membership_payment_pkey" PRIMARY KEY ("annual_program_id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."pwd_ids"
    ADD CONSTRAINT "pwd_id_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."relationship_cc"
    ADD CONSTRAINT "relationship_cc_pkey" PRIMARY KEY ("caregiver");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."service_category"
    ADD CONSTRAINT "service_category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_objective"
    ADD CONSTRAINT "service_objective_annual_program_id_key" UNIQUE ("annual_program_id");



ALTER TABLE ONLY "public"."service_objective"
    ADD CONSTRAINT "service_objective_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_objective"
    ADD CONSTRAINT "service_objective_service_category_id_key" UNIQUE ("service_category_id");



ALTER TABLE ONLY "public"."social_protection_status"
    ADD CONSTRAINT "social_protection_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "unique_role_permission" UNIQUE ("role_id", "permission_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("role_id", "user_id");



CREATE INDEX "idx_profiles_created_at" ON "public"."user_profiles" USING "btree" ("created_at");



CREATE INDEX "idx_profiles_email" ON "public"."user_profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_username" ON "public"."user_profiles" USING "btree" ("username");



CREATE OR REPLACE TRIGGER "update_permissions_update_at" BEFORE UPDATE ON "account"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "account"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_education_status_update_at" BEFORE UPDATE ON "public"."education_status" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_intervention_update_at" BEFORE UPDATE ON "public"."intervention" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_members_update_at" BEFORE UPDATE ON "public"."members" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_membership_annual_renewal_update_at" BEFORE UPDATE ON "public"."membership_annual_renewal" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_role_permissions_update_at" BEFORE UPDATE ON "public"."role_permissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_social_protection_status_update_at" BEFORE UPDATE ON "public"."social_protection_status" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."activity"
    ADD CONSTRAINT "activity_target_activity_id_fkey" FOREIGN KEY ("target_activity_id") REFERENCES "public"."major_target_activity"("id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "public"."barangays"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."attendance_log"
    ADD CONSTRAINT "attendance_log_conducted_activity_id_fkey" FOREIGN KEY ("conducted_activity_id") REFERENCES "public"."activity"("id");



ALTER TABLE ONLY "public"."attendance_log"
    ADD CONSTRAINT "attendance_log_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."barangays"
    ADD CONSTRAINT "barangays_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id");



ALTER TABLE ONLY "public"."caregiver_groups"
    ADD CONSTRAINT "caregiver_groups_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "public"."caregivers"("id");



ALTER TABLE ONLY "public"."caregiver_groups"
    ADD CONSTRAINT "caregiver_groups_community_group_id_fkey" FOREIGN KEY ("community_group_id") REFERENCES "public"."community_group_type"("id");



ALTER TABLE ONLY "public"."caregivers"
    ADD CONSTRAINT "caregivers_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "public"."income_type"("id");



ALTER TABLE ONLY "public"."caregivers"
    ADD CONSTRAINT "caregivers_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."children"
    ADD CONSTRAINT "children_disability_id_fkey" FOREIGN KEY ("disability_id") REFERENCES "public"."disability_category"("id");



ALTER TABLE ONLY "public"."children"
    ADD CONSTRAINT "children_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."children"
    ADD CONSTRAINT "children_pwd_id_fkey" FOREIGN KEY ("pwd_id") REFERENCES "public"."pwd_ids"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."education_status"
    ADD CONSTRAINT "education_status_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."employment_status"
    ADD CONSTRAINT "employment_status_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."family_members"
    ADD CONSTRAINT "family_members_family_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."family_members"
    ADD CONSTRAINT "family_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."intervention"
    ADD CONSTRAINT "intervention_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."intervention_history"
    ADD CONSTRAINT "intervention_history_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "public"."intervention"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."intervention"
    ADD CONSTRAINT "intervention_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "public"."service_category"("id");



ALTER TABLE ONLY "public"."major_target_activity"
    ADD CONSTRAINT "major_target_activity_service_objective_id_fkey" FOREIGN KEY ("service_objective_id") REFERENCES "public"."service_objective"("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."membership_annual_renewal"
    ADD CONSTRAINT "membership_annual_renewal_annual_program_id_fkey" FOREIGN KEY ("annual_program_id") REFERENCES "public"."annual_program"("id");



ALTER TABLE ONLY "public"."membership_annual_renewal"
    ADD CONSTRAINT "membership_annual_renewal_family_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."membership_payment"
    ADD CONSTRAINT "membership_payment_annual_program_id_fkey" FOREIGN KEY ("annual_program_id") REFERENCES "public"."annual_program"("id");



ALTER TABLE ONLY "public"."membership_payment"
    ADD CONSTRAINT "membership_payment_family_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id");



ALTER TABLE ONLY "public"."relationship_cc"
    ADD CONSTRAINT "relationship_cc_caregiver_fkey" FOREIGN KEY ("caregiver") REFERENCES "public"."caregivers"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."relationship_cc"
    ADD CONSTRAINT "relationship_cc_child_fkey" FOREIGN KEY ("child") REFERENCES "public"."children"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_objective"
    ADD CONSTRAINT "service_objective_annual_program_id_fkey" FOREIGN KEY ("annual_program_id") REFERENCES "public"."annual_program"("id");



ALTER TABLE ONLY "public"."service_objective"
    ADD CONSTRAINT "service_objective_service_category_id_fkey" FOREIGN KEY ("service_category_id") REFERENCES "public"."service_category"("id");



ALTER TABLE ONLY "public"."social_protection_status"
    ADD CONSTRAINT "social_protection_status_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE "account"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Admin with permission can create roles" ON "public"."user_roles" FOR INSERT WITH CHECK ("account"."user_has_permission"("auth"."uid"(), 'user_roles:create'::"text"));



CREATE POLICY "Admins can view all user roles" ON "public"."user_roles" FOR SELECT USING (("account"."user_has_permission"("auth"."uid"(), 'user_roles:retrieve'::"text") AND (( SELECT "r1"."level"
   FROM ("public"."user_roles" "u1"
     JOIN "public"."roles" "r1" ON (("u1"."role_id" = "r1"."id")))
  WHERE ("u1"."user_id" = "auth"."uid"())) > ( SELECT "r2"."level"
   FROM ("public"."user_roles" "u2"
     JOIN "public"."roles" "r2" ON (("u2"."role_id" = "r2"."id")))
  WHERE ("u2"."user_id" = "user_roles"."user_id")))));



CREATE POLICY "Everyone can read permissions" ON "public"."permissions" FOR SELECT USING (true);



CREATE POLICY "Everyone can read roles" ON "public"."role_permissions" FOR SELECT USING (true);



CREATE POLICY "Everyone can read roles" ON "public"."roles" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone" ON "public"."user_profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile" ON "public"."user_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own roles" ON "public"."user_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users with permission can create new permissions for roles" ON "public"."role_permissions" FOR INSERT WITH CHECK ("account"."user_has_permission"("auth"."uid"(), 'role_permissions:create'::"text"));



CREATE POLICY "Users with permission can create permissions" ON "public"."permissions" FOR INSERT WITH CHECK ("account"."user_has_permission"("auth"."uid"(), 'permissions:create'::"text"));



CREATE POLICY "Users with permission can create roles" ON "public"."roles" FOR INSERT WITH CHECK ("account"."user_has_permission"("auth"."uid"(), 'roles:create'::"text"));



CREATE POLICY "Users with permission can delete new permissions for roles" ON "public"."role_permissions" FOR DELETE USING (("account"."user_has_permission"("auth"."uid"(), 'role_permissions:delete'::"text") AND ("is_system" = false)));



CREATE POLICY "Users with permission can delete non-system permissions" ON "public"."permissions" FOR DELETE USING (("account"."user_has_permission"("auth"."uid"(), 'permissions:delete'::"text") AND ("is_system" = false)));



CREATE POLICY "Users with permission can delete non-system roles" ON "public"."roles" FOR DELETE USING (("account"."user_has_permission"("auth"."uid"(), 'roles:delete'::"text") AND ("is_system" = false)));



CREATE POLICY "Users with permission can delete with lower priority" ON "public"."user_roles" FOR DELETE USING (("account"."user_has_permission"("auth"."uid"(), 'user_roles:delete'::"text") AND (( SELECT "r1"."level"
   FROM ("public"."user_roles" "u1"
     JOIN "public"."roles" "r1" ON (("u1"."role_id" = "r1"."id")))
  WHERE ("u1"."user_id" = "auth"."uid"())) > ( SELECT "r2"."level"
   FROM ("public"."user_roles" "u2"
     JOIN "public"."roles" "r2" ON (("u2"."role_id" = "r2"."id")))
  WHERE ("u2"."user_id" = "user_roles"."user_id")))));



CREATE POLICY "Users with permission can update new permissions for roles" ON "public"."role_permissions" FOR UPDATE USING (("account"."user_has_permission"("auth"."uid"(), 'role_permissions:update'::"text") AND ("is_system" = false))) WITH CHECK (("account"."user_has_permission"("auth"."uid"(), 'role_permissions:update'::"text") AND ("is_system" = false)));



CREATE POLICY "Users with permission can update non-system permissions" ON "public"."permissions" FOR UPDATE USING (("account"."user_has_permission"("auth"."uid"(), 'permissions:update'::"text") AND ("is_system" = false))) WITH CHECK (("account"."user_has_permission"("auth"."uid"(), 'permissions:update'::"text") AND ("is_system" = false)));



CREATE POLICY "Users with permission can update non-system roles" ON "public"."roles" FOR UPDATE USING (("account"."user_has_permission"("auth"."uid"(), 'roles:update'::"text") AND ("is_system" = false))) WITH CHECK (("account"."user_has_permission"("auth"."uid"(), 'roles:update'::"text") AND ("is_system" = false)));



CREATE POLICY "Users with permission can update roles" ON "public"."user_roles" FOR UPDATE USING (("account"."user_has_permission"("auth"."uid"(), 'user_roles:update'::"text") AND (( SELECT "r1"."level"
   FROM ("public"."user_roles" "u1"
     JOIN "public"."roles" "r1" ON (("u1"."role_id" = "r1"."id")))
  WHERE ("u1"."user_id" = "auth"."uid"())) > ( SELECT "r2"."level"
   FROM ("public"."user_roles" "u2"
     JOIN "public"."roles" "r2" ON (("u2"."role_id" = "r2"."id")))
  WHERE ("u2"."user_id" = "user_roles"."user_id")))));



ALTER TABLE "public"."activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."annual_program" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."attendance_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."barangays" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."caregiver_groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."caregivers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."children" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_group_type" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."disability_category" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."education_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employment_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."families" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."family_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."income_type" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."intervention" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."intervention_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."major_target_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."membership_annual_renewal" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."membership_payment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pwd_ids" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."relationship_cc" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_category" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_objective" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."social_protection_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "account"."users";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_permission"("permission_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_permission"("permission_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_permission"("permission_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") TO "service_role";












GRANT ALL ON TABLE "account"."users" TO "anon";
GRANT ALL ON TABLE "account"."users" TO "authenticated";
GRANT ALL ON TABLE "account"."users" TO "service_role";









GRANT ALL ON TABLE "public"."activity" TO "anon";
GRANT ALL ON TABLE "public"."activity" TO "authenticated";
GRANT ALL ON TABLE "public"."activity" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON TABLE "public"."annual_program" TO "anon";
GRANT ALL ON TABLE "public"."annual_program" TO "authenticated";
GRANT ALL ON TABLE "public"."annual_program" TO "service_role";



GRANT ALL ON SEQUENCE "public"."annual_program_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."annual_program_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."annual_program_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."attendance_log" TO "anon";
GRANT ALL ON TABLE "public"."attendance_log" TO "authenticated";
GRANT ALL ON TABLE "public"."attendance_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."attendance_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."attendance_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."attendance_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."barangays" TO "anon";
GRANT ALL ON TABLE "public"."barangays" TO "authenticated";
GRANT ALL ON TABLE "public"."barangays" TO "service_role";



GRANT ALL ON SEQUENCE "public"."barangays_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."barangays_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."barangays_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."caregiver_groups" TO "anon";
GRANT ALL ON TABLE "public"."caregiver_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."caregiver_groups" TO "service_role";



GRANT ALL ON SEQUENCE "public"."caregiver_groups_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."caregiver_groups_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."caregiver_groups_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."caregivers" TO "anon";
GRANT ALL ON TABLE "public"."caregivers" TO "authenticated";
GRANT ALL ON TABLE "public"."caregivers" TO "service_role";



GRANT ALL ON TABLE "public"."children" TO "anon";
GRANT ALL ON TABLE "public"."children" TO "authenticated";
GRANT ALL ON TABLE "public"."children" TO "service_role";



GRANT ALL ON TABLE "public"."cities" TO "anon";
GRANT ALL ON TABLE "public"."cities" TO "authenticated";
GRANT ALL ON TABLE "public"."cities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cities_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cities_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."cities_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cities_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."community_group_type" TO "anon";
GRANT ALL ON TABLE "public"."community_group_type" TO "authenticated";
GRANT ALL ON TABLE "public"."community_group_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."community_group_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."community_group_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."community_group_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."disability_category" TO "anon";
GRANT ALL ON TABLE "public"."disability_category" TO "authenticated";
GRANT ALL ON TABLE "public"."disability_category" TO "service_role";



GRANT ALL ON SEQUENCE "public"."disabilities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."disabilities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."disabilities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."education_status" TO "anon";
GRANT ALL ON TABLE "public"."education_status" TO "authenticated";
GRANT ALL ON TABLE "public"."education_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."education_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."education_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."education_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."employment_status" TO "anon";
GRANT ALL ON TABLE "public"."employment_status" TO "authenticated";
GRANT ALL ON TABLE "public"."employment_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."employment_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."employment_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."employment_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."families" TO "anon";
GRANT ALL ON TABLE "public"."families" TO "authenticated";
GRANT ALL ON TABLE "public"."families" TO "service_role";



GRANT ALL ON TABLE "public"."family_members" TO "anon";
GRANT ALL ON TABLE "public"."family_members" TO "authenticated";
GRANT ALL ON TABLE "public"."family_members" TO "service_role";



GRANT ALL ON TABLE "public"."income_type" TO "anon";
GRANT ALL ON TABLE "public"."income_type" TO "authenticated";
GRANT ALL ON TABLE "public"."income_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."income_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."income_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."income_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."intervention" TO "anon";
GRANT ALL ON TABLE "public"."intervention" TO "authenticated";
GRANT ALL ON TABLE "public"."intervention" TO "service_role";



GRANT ALL ON TABLE "public"."intervention_history" TO "anon";
GRANT ALL ON TABLE "public"."intervention_history" TO "authenticated";
GRANT ALL ON TABLE "public"."intervention_history" TO "service_role";



GRANT ALL ON TABLE "public"."major_target_activity" TO "anon";
GRANT ALL ON TABLE "public"."major_target_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."major_target_activity" TO "service_role";



GRANT ALL ON SEQUENCE "public"."major_target_activity_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."major_target_activity_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."major_target_activity_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."members" TO "anon";
GRANT ALL ON TABLE "public"."members" TO "authenticated";
GRANT ALL ON TABLE "public"."members" TO "service_role";



GRANT ALL ON TABLE "public"."membership_annual_renewal" TO "anon";
GRANT ALL ON TABLE "public"."membership_annual_renewal" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_annual_renewal" TO "service_role";



GRANT ALL ON SEQUENCE "public"."membership_annual_renewal_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."membership_annual_renewal_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."membership_annual_renewal_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."membership_payment" TO "anon";
GRANT ALL ON TABLE "public"."membership_payment" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_payment" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON TABLE "public"."pwd_ids" TO "anon";
GRANT ALL ON TABLE "public"."pwd_ids" TO "authenticated";
GRANT ALL ON TABLE "public"."pwd_ids" TO "service_role";



GRANT ALL ON TABLE "public"."relationship_cc" TO "anon";
GRANT ALL ON TABLE "public"."relationship_cc" TO "authenticated";
GRANT ALL ON TABLE "public"."relationship_cc" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."service_category" TO "anon";
GRANT ALL ON TABLE "public"."service_category" TO "authenticated";
GRANT ALL ON TABLE "public"."service_category" TO "service_role";



GRANT ALL ON SEQUENCE "public"."service_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."service_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."service_category_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."service_objective" TO "anon";
GRANT ALL ON TABLE "public"."service_objective" TO "authenticated";
GRANT ALL ON TABLE "public"."service_objective" TO "service_role";



GRANT ALL ON SEQUENCE "public"."service_objective_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."service_objective_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."service_objective_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."social_protection_status" TO "anon";
GRANT ALL ON TABLE "public"."social_protection_status" TO "authenticated";
GRANT ALL ON TABLE "public"."social_protection_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."social_protection_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."social_protection_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."social_protection_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
