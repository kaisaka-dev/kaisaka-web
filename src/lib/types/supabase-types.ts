export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity: {
        Row: {
          completion_status:
            | Database["public"]["Enums"]["completion_status_enum"]
            | null
          date_and_time_conducted: string
          date_and_time_created: string
          date_and_time_last_updated: string
          id: number
          indicators: string | null
          name: string
          outcome: string | null
          remarks: string | null
          target_activity_id: number
          type: string
        }
        Insert: {
          completion_status?:
            | Database["public"]["Enums"]["completion_status_enum"]
            | null
          date_and_time_conducted?: string
          date_and_time_created?: string
          date_and_time_last_updated?: string
          id?: number
          indicators?: string | null
          name: string
          outcome?: string | null
          remarks?: string | null
          target_activity_id: number
          type: string
        }
        Update: {
          completion_status?:
            | Database["public"]["Enums"]["completion_status_enum"]
            | null
          date_and_time_conducted?: string
          date_and_time_created?: string
          date_and_time_last_updated?: string
          id?: number
          indicators?: string | null
          name?: string
          outcome?: string | null
          remarks?: string | null
          target_activity_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_target_activity_id_fkey"
            columns: ["target_activity_id"]
            isOneToOne: true
            referencedRelation: "major_target_activity"
            referencedColumns: ["id"]
          },
        ]
      }
      addresses: {
        Row: {
          address: string
          barangay_id: number
          id: string
        }
        Insert: {
          address: string
          barangay_id: number
          id?: string
        }
        Update: {
          address?: string
          barangay_id?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_barangay_id_fkey"
            columns: ["barangay_id"]
            isOneToOne: false
            referencedRelation: "barangays"
            referencedColumns: ["id"]
          },
        ]
      }
      annual_program: {
        Row: {
          date_created: string
          end_date: number | null
          end_month: number | null
          end_year: number
          general_reflection: string | null
          id: number
          lessons_learned: string | null
          start_date: number | null
          start_month: number | null
          start_year: number
          target_new_cwds: number
        }
        Insert: {
          date_created?: string
          end_date?: number | null
          end_month?: number | null
          end_year: number
          general_reflection?: string | null
          id?: number
          lessons_learned?: string | null
          start_date?: number | null
          start_month?: number | null
          start_year: number
          target_new_cwds: number
        }
        Update: {
          date_created?: string
          end_date?: number | null
          end_month?: number | null
          end_year?: number
          general_reflection?: string | null
          id?: number
          lessons_learned?: string | null
          start_date?: number | null
          start_month?: number | null
          start_year?: number
          target_new_cwds?: number
        }
        Relationships: []
      }
      attendance_log: {
        Row: {
          conducted_activity_id: number
          id: number
          individual_intervention_plan: boolean | null
          is_late: boolean
          participant_id: string
          participant_type:
            | Database["public"]["Enums"]["participant_type_enum"]
            | null
          remarks: string | null
          transition_graduation_plan: boolean | null
        }
        Insert: {
          conducted_activity_id: number
          id?: number
          individual_intervention_plan?: boolean | null
          is_late?: boolean
          participant_id: string
          participant_type?:
            | Database["public"]["Enums"]["participant_type_enum"]
            | null
          remarks?: string | null
          transition_graduation_plan?: boolean | null
        }
        Update: {
          conducted_activity_id?: number
          id?: number
          individual_intervention_plan?: boolean | null
          is_late?: boolean
          participant_id?: string
          participant_type?:
            | Database["public"]["Enums"]["participant_type_enum"]
            | null
          remarks?: string | null
          transition_graduation_plan?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_log_conducted_activity_id_fkey"
            columns: ["conducted_activity_id"]
            isOneToOne: true
            referencedRelation: "activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_log_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      barangays: {
        Row: {
          city_id: number | null
          id: number
          name: string
          num: string | null
        }
        Insert: {
          city_id?: number | null
          id?: number
          name: string
          num?: string | null
        }
        Update: {
          city_id?: number | null
          id?: number
          name?: string
          num?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barangays_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      caregiver_groups: {
        Row: {
          caregiver_id: string
          community_group_id: number
          date_joined: string
          date_left: string | null
          id: number
        }
        Insert: {
          caregiver_id: string
          community_group_id: number
          date_joined?: string
          date_left?: string | null
          id?: number
        }
        Update: {
          caregiver_id?: string
          community_group_id?: number
          date_joined?: string
          date_left?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "caregiver_groups_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caregiver_groups_community_group_id_fkey"
            columns: ["community_group_id"]
            isOneToOne: false
            referencedRelation: "community_group_type"
            referencedColumns: ["id"]
          },
        ]
      }
      caregivers: {
        Row: {
          contact_number: string
          email: string | null
          facebook_link: string | null
          id: string
          income_id: number | null
          member_id: string
          occupation: string | null
        }
        Insert: {
          contact_number: string
          email?: string | null
          facebook_link?: string | null
          id?: string
          income_id?: number | null
          member_id?: string
          occupation?: string | null
        }
        Update: {
          contact_number?: string
          email?: string | null
          facebook_link?: string | null
          id?: string
          income_id?: number | null
          member_id?: string
          occupation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caregivers_income_id_fkey"
            columns: ["income_id"]
            isOneToOne: true
            referencedRelation: "income_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caregivers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          disability_id: number | null
          disability_nature: string | null
          has_barangay_cert: boolean
          has_birth_cert: boolean
          has_medical_cert: boolean
          has_national_id: boolean
          has_philhealth: boolean
          has_vote: boolean
          id: string
          is_active: boolean
          member_id: string | null
          pwd_id: string | null
          remarks: string | null
        }
        Insert: {
          disability_id?: number | null
          disability_nature?: string | null
          has_barangay_cert?: boolean
          has_birth_cert?: boolean
          has_medical_cert?: boolean
          has_national_id?: boolean
          has_philhealth?: boolean
          has_vote?: boolean
          id?: string
          is_active?: boolean
          member_id?: string | null
          pwd_id?: string | null
          remarks?: string | null
        }
        Update: {
          disability_id?: number | null
          disability_nature?: string | null
          has_barangay_cert?: boolean
          has_birth_cert?: boolean
          has_medical_cert?: boolean
          has_national_id?: boolean
          has_philhealth?: boolean
          has_vote?: boolean
          id?: string
          is_active?: boolean
          member_id?: string | null
          pwd_id?: string | null
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_disability_id_fkey"
            columns: ["disability_id"]
            isOneToOne: false
            referencedRelation: "disability_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_pwd_id_fkey"
            columns: ["pwd_id"]
            isOneToOne: false
            referencedRelation: "pwd_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          city_name: string
          id: number
        }
        Insert: {
          city_name: string
          id?: number
        }
        Update: {
          city_name?: string
          id?: number
        }
        Relationships: []
      }
      community_group_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      disability_category: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      education_status: {
        Row: {
          child_id: string | null
          date_created: string
          education_type:
            | Database["public"]["Enums"]["education_type_enum"]
            | null
          grade_level: string | null
          id: number
          last_updated: string
          student_status_type:
            | Database["public"]["Enums"]["student_status_enum"]
            | null
          year_end: number | null
          year_start: number
        }
        Insert: {
          child_id?: string | null
          date_created?: string
          education_type?:
            | Database["public"]["Enums"]["education_type_enum"]
            | null
          grade_level?: string | null
          id?: number
          last_updated: string
          student_status_type?:
            | Database["public"]["Enums"]["student_status_enum"]
            | null
          year_end?: number | null
          year_start: number
        }
        Update: {
          child_id?: string | null
          date_created?: string
          education_type?:
            | Database["public"]["Enums"]["education_type_enum"]
            | null
          grade_level?: string | null
          id?: number
          last_updated?: string
          student_status_type?:
            | Database["public"]["Enums"]["student_status_enum"]
            | null
          year_end?: number | null
          year_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "education_status_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      employment_status: {
        Row: {
          able_to_work: boolean
          employment_type:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null
          id: number
          member_id: string
        }
        Insert: {
          able_to_work?: boolean
          employment_type?:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null
          id?: number
          member_id: string
        }
        Update: {
          able_to_work?: boolean
          employment_type?:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null
          id?: number
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employment_status_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          date_created: string
          id: string
        }
        Insert: {
          date_created?: string
          id?: string
        }
        Update: {
          date_created?: string
          id?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          date_added: string
          family_id: string
          is_child: boolean
          member_id: string
          relationship_type: string | null
        }
        Insert: {
          date_added?: string
          family_id?: string
          is_child: boolean
          member_id?: string
          relationship_type?: string | null
        }
        Update: {
          date_added?: string
          family_id?: string
          is_child?: boolean
          member_id?: string
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      income_type: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      intervention: {
        Row: {
          child_id: string
          date_created: string
          id: string
          intervention: string
          last_updated: string
          remarks: string | null
          service_category_id: number
          status: Database["public"]["Enums"]["improvement_status_enum"]
        }
        Insert: {
          child_id?: string
          date_created?: string
          id?: string
          intervention: string
          last_updated: string
          remarks?: string | null
          service_category_id: number
          status: Database["public"]["Enums"]["improvement_status_enum"]
        }
        Update: {
          child_id?: string
          date_created?: string
          id?: string
          intervention?: string
          last_updated?: string
          remarks?: string | null
          service_category_id?: number
          status?: Database["public"]["Enums"]["improvement_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "intervention_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: true
            referencedRelation: "service_category"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_history: {
        Row: {
          date_checked: string
          id: string
          improvement: string
          intervention_id: string
          remarks: string | null
          status: Database["public"]["Enums"]["improvement_status_enum"]
        }
        Insert: {
          date_checked?: string
          id?: string
          improvement?: string
          intervention_id?: string
          remarks?: string | null
          status: Database["public"]["Enums"]["improvement_status_enum"]
        }
        Update: {
          date_checked?: string
          id?: string
          improvement?: string
          intervention_id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["improvement_status_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "intervention_history_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "intervention"
            referencedColumns: ["id"]
          },
        ]
      }
      major_target_activity: {
        Row: {
          date_and_time_created: string
          date_and_time_last_updated: string
          id: number
          name: string
          remarks: string | null
          service_objective_id: number
          target_no_of_participants: number
          type: string
        }
        Insert: {
          date_and_time_created?: string
          date_and_time_last_updated: string
          id?: number
          name: string
          remarks?: string | null
          service_objective_id: number
          target_no_of_participants: number
          type: string
        }
        Update: {
          date_and_time_created?: string
          date_and_time_last_updated?: string
          id?: number
          name?: string
          remarks?: string | null
          service_objective_id?: number
          target_no_of_participants?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "major_target_activity_service_objective_id_fkey"
            columns: ["service_objective_id"]
            isOneToOne: true
            referencedRelation: "service_objective"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address_id: string | null
          admission_date: string | null
          birthday: string | null
          date_created: string
          first_name: string
          id: string
          last_approved: string | null
          last_name: string
          last_updated: string | null
          middle_name: string | null
          sex: Database["public"]["Enums"]["sex_enum"]
        }
        Insert: {
          address_id?: string | null
          admission_date?: string | null
          birthday?: string | null
          date_created?: string
          first_name: string
          id?: string
          last_approved?: string | null
          last_name: string
          last_updated?: string | null
          middle_name?: string | null
          sex: Database["public"]["Enums"]["sex_enum"]
        }
        Update: {
          address_id?: string | null
          admission_date?: string | null
          birthday?: string | null
          date_created?: string
          first_name?: string
          id?: string
          last_approved?: string | null
          last_name?: string
          last_updated?: string | null
          middle_name?: string | null
          sex?: Database["public"]["Enums"]["sex_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "members_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_annual_renewal: {
        Row: {
          annual_program_id: number
          date_created: string
          family_id: string
          id: number
          last_updated: string
          remarks: string | null
          total_amount_due: number
        }
        Insert: {
          annual_program_id: number
          date_created?: string
          family_id?: string
          id?: number
          last_updated?: string
          remarks?: string | null
          total_amount_due: number
        }
        Update: {
          annual_program_id?: number
          date_created?: string
          family_id?: string
          id?: number
          last_updated?: string
          remarks?: string | null
          total_amount_due?: number
        }
        Relationships: [
          {
            foreignKeyName: "membership_annual_renewal_annual_program_id_fkey"
            columns: ["annual_program_id"]
            isOneToOne: false
            referencedRelation: "annual_program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_annual_renewal_family_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_payment: {
        Row: {
          amount_paid: number | null
          annual_program_id: number
          date_created: string
          date_paid: string | null
          family_id: string | null
          remarks: string | null
        }
        Insert: {
          amount_paid?: number | null
          annual_program_id: number
          date_created?: string
          date_paid?: string | null
          family_id?: string | null
          remarks?: string | null
        }
        Update: {
          amount_paid?: number | null
          annual_program_id?: number
          date_created?: string
          date_paid?: string | null
          family_id?: string | null
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_payment_annual_program_id_fkey"
            columns: ["annual_program_id"]
            isOneToOne: true
            referencedRelation: "annual_program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_payment_family_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: Database["public"]["Enums"]["actions"]
          created_at: string
          description: string
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          resource: Database["public"]["Enums"]["resources"]
          updated_at: string
        }
        Insert: {
          action: Database["public"]["Enums"]["actions"]
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          resource: Database["public"]["Enums"]["resources"]
          updated_at?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["actions"]
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          resource?: Database["public"]["Enums"]["resources"]
          updated_at?: string
        }
        Relationships: []
      }
      pwd_ids: {
        Row: {
          expiry_date: string
          id: string
          pwd_id: string
        }
        Insert: {
          expiry_date: string
          id?: string
          pwd_id: string
        }
        Update: {
          expiry_date?: string
          id?: string
          pwd_id?: string
        }
        Relationships: []
      }
      relationship_cc: {
        Row: {
          caregiver: string
          child: string
          relationship: string | null
        }
        Insert: {
          caregiver?: string
          child?: string
          relationship?: string | null
        }
        Update: {
          caregiver?: string
          child?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_cc_caregiver_fkey"
            columns: ["caregiver"]
            isOneToOne: true
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationship_cc_child_fkey"
            columns: ["child"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          granted: boolean
          is_system: boolean
          permission_id: string
          role_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          granted: boolean
          is_system?: boolean
          permission_id?: string
          role_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          granted?: boolean
          is_system?: boolean
          permission_id?: string
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string
          id: string
          is_system: boolean
          level: number
          name: string
          slug: string
        }
        Insert: {
          description?: string
          id?: string
          is_system?: boolean
          level?: number
          name: string
          slug: string
        }
        Update: {
          description?: string
          id?: string
          is_system?: boolean
          level?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      service_category: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      service_objective: {
        Row: {
          annual_program_id: number
          id: number
          objective_description: string
          service_category_id: number
        }
        Insert: {
          annual_program_id: number
          id?: number
          objective_description: string
          service_category_id: number
        }
        Update: {
          annual_program_id?: number
          id?: number
          objective_description?: string
          service_category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_objective_annual_program_id_fkey"
            columns: ["annual_program_id"]
            isOneToOne: true
            referencedRelation: "annual_program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_objective_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: true
            referencedRelation: "service_category"
            referencedColumns: ["id"]
          },
        ]
      }
      social_protection_status: {
        Row: {
          child_id: string
          comm_year_accessed: number | null
          date_created: string
          fam_year_accessed: number | null
          id: number
          last_updated: string | null
          participates_community_club: boolean | null
          participates_family_life: boolean | null
        }
        Insert: {
          child_id?: string
          comm_year_accessed?: number | null
          date_created?: string
          fam_year_accessed?: number | null
          id?: number
          last_updated?: string | null
          participates_community_club?: boolean | null
          participates_family_life?: boolean | null
        }
        Update: {
          child_id?: string
          comm_year_accessed?: number | null
          date_created?: string
          fam_year_accessed?: number | null
          id?: number
          last_updated?: string | null
          participates_community_club?: boolean | null
          participates_family_life?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "social_protection_status_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id?: string
          user_id?: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_permission: {
        Args:
          | { permission_name: string }
          | { user_uuid?: string; permission_name?: string }
        Returns: boolean
      }
    }
    Enums: {
      actions: "create" | "retrieve" | "update" | "delete"
      comp_status: "planned" | "completed" | "cancelled"
      completion_status_enum: "planned" | "completed" | "cancelled"
      education_type_enum:
        | "Home Program"
        | "Nonformal"
        | "Integrated/SPED"
        | "Inclusive/Gen. Ed."
      employment_type_enum:
        | "Wage Employed"
        | "Self-Employed"
        | "Sheltered Workshop"
      improvement_status_enum: "Improved" | "Neutral" | "Regressed"
      intervention_type: "education" | "social"
      part_type: "caregiver" | "child"
      participant_type_enum: "caregiver" | "child"
      resources:
        | "activity"
        | "addresses"
        | "annual_program"
        | "attendance_log"
        | "barangays"
        | "caregiver_groups"
        | "caregivers"
        | "children"
        | "cities"
        | "communit_group_type"
        | "disability_category"
        | "education_status"
        | "families"
        | "family_members"
        | "income_type"
        | "intervention"
        | "intervention_history"
        | "major_target_activity"
        | "members"
        | "membership_annual_renewal"
        | "membership_payment"
        | "philhealth_ids"
        | "pwd_ids"
        | "relationship_cc"
        | "service_category"
        | "service_objective"
        | "sessions"
        | "social_protection_status"
        | "streets"
        | "users"
        | "roles"
        | "role_permissions"
        | "permissions"
        | "user_roles"
      sex_enum: "Male" | "Female" | "Other"
      student_status_enum:
        | "past_student"
        | "new_student"
        | "dropped_out"
        | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      actions: ["create", "retrieve", "update", "delete"],
      comp_status: ["planned", "completed", "cancelled"],
      completion_status_enum: ["planned", "completed", "cancelled"],
      education_type_enum: [
        "Home Program",
        "Nonformal",
        "Integrated/SPED",
        "Inclusive/Gen. Ed.",
      ],
      employment_type_enum: [
        "Wage Employed",
        "Self-Employed",
        "Sheltered Workshop",
      ],
      improvement_status_enum: ["Improved", "Neutral", "Regressed"],
      intervention_type: ["education", "social"],
      part_type: ["caregiver", "child"],
      participant_type_enum: ["caregiver", "child"],
      resources: [
        "activity",
        "addresses",
        "annual_program",
        "attendance_log",
        "barangays",
        "caregiver_groups",
        "caregivers",
        "children",
        "cities",
        "communit_group_type",
        "disability_category",
        "education_status",
        "families",
        "family_members",
        "income_type",
        "intervention",
        "intervention_history",
        "major_target_activity",
        "members",
        "membership_annual_renewal",
        "membership_payment",
        "philhealth_ids",
        "pwd_ids",
        "relationship_cc",
        "service_category",
        "service_objective",
        "sessions",
        "social_protection_status",
        "streets",
        "users",
        "roles",
        "role_permissions",
        "permissions",
        "user_roles",
      ],
      sex_enum: ["Male", "Female", "Other"],
      student_status_enum: [
        "past_student",
        "new_student",
        "dropped_out",
        "completed",
      ],
    },
  },
} as const
