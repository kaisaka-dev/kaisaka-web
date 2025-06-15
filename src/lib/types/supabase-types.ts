export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]



export type Database = {
  public: {
    Tables: {
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
          id?: never
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
          id?: never
          lessons_learned?: string | null
          start_date?: number | null
          start_month?: number | null
          start_year?: number
          target_new_cwds?: number
        }
        Relationships: []
      }
      barangays: {
        Row: {
          barangay: string | null
          city: string
          id: number
          name: string
          num: string | null
        }
        Insert: {
          barangay?: string | null
          city: string
          id: number
          name: string
          num?: string | null
        }
        Update: {
          barangay?: string | null
          city?: string
          id?: number
          name?: string
          num?: string | null
        }
        Relationships: []
      }
      caregivers: {
        Row: {
          contact_number: string | null
          email: string | null
          facebook_link: string | null
          id: number
          member_id: number
          occupation: string | null
          remarks: string | null
        }
        Insert: {
          contact_number?: string | null
          email?: string | null
          facebook_link?: string | null
          id?: number
          member_id: number
          occupation?: string | null
          remarks?: string | null
        }
        Update: {
          contact_number?: string | null
          email?: string | null
          facebook_link?: string | null
          id?: number
          member_id?: number
          occupation?: string | null
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caregiver_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          has_barangay_cert: boolean
          has_birth_cert: boolean
          has_medical_cert: boolean
          has_philhealth: boolean
          id: number
          is_active: boolean
          member_id: number
          philhealth_id: number | null
          pwd_id: string
          remarks: string
        }
        Insert: {
          has_barangay_cert: boolean
          has_birth_cert: boolean
          has_medical_cert: boolean
          has_philhealth: boolean
          id?: number
          is_active?: boolean
          member_id: number
          philhealth_id?: number | null
          pwd_id: string
          remarks: string
        }
        Update: {
          has_barangay_cert?: boolean
          has_birth_cert?: boolean
          has_medical_cert?: boolean
          has_philhealth?: boolean
          id?: number
          is_active?: boolean
          member_id?: number
          philhealth_id?: number | null
          pwd_id?: string
          remarks?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_philhealth_id_fkey"
            columns: ["philhealth_id"]
            isOneToOne: false
            referencedRelation: "philhealth_ids"
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
      disabilities: {
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
      disability_status: {
        Row: {
          child_id: number | null
          date_created: string | null
          disability_id: number | null
          disability_nature: string | null
          id: number
          last_updated: string | null
        }
        Insert: {
          child_id?: number | null
          date_created?: string | null
          disability_id?: number | null
          disability_nature?: string | null
          id?: number
          last_updated?: string | null
        }
        Update: {
          child_id?: number | null
          date_created?: string | null
          disability_id?: number | null
          disability_nature?: string | null
          id?: number
          last_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disability_status_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disability_status_disability_id_fkey"
            columns: ["disability_id"]
            isOneToOne: false
            referencedRelation: "disabilities"
            referencedColumns: ["id"]
          },
        ]
      }
      education_status: {
        Row: {
          child_id: number
          date_created: string
          education_type:
            | Database["public"]["Enums"]["education_type_enum"]
            | null
          grade_level: number | null
          id: number
          last_updated: string
          year_end: number | null
          year_start: number
        }
        Insert: {
          child_id: number
          date_created?: string
          education_type?:
            | Database["public"]["Enums"]["education_type_enum"]
            | null
          grade_level?: number | null
          id?: number
          last_updated: string
          year_end?: number | null
          year_start: number
        }
        Update: {
          child_id?: number
          date_created?: string
          education_type?:
            | Database["public"]["Enums"]["education_type_enum"]
            | null
          grade_level?: number | null
          id?: number
          last_updated?: string
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
          child_id: number
          employment_type:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null
          id: number
        }
        Insert: {
          able_to_work?: boolean
          child_id: number
          employment_type?:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null
          id?: number
        }
        Update: {
          able_to_work?: boolean
          child_id?: number
          employment_type?:
            | Database["public"]["Enums"]["employment_type_enum"]
            | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "employment_status_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          date_created: string
          id: number
        }
        Insert: {
          date_created?: string
          id?: number
        }
        Update: {
          date_created?: string
          id?: number
        }
        Relationships: []
      }
      family_members: {
        Row: {
          date_added: string
          family_id: number
          is_child: boolean
          member_id: number
          relationship_type: string | null
        }
        Insert: {
          date_added?: string
          family_id: number
          is_child: boolean
          member_id: number
          relationship_type?: string | null
        }
        Update: {
          date_added?: string
          family_id?: number
          is_child?: boolean
          member_id?: number
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_to_family_relationship_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_to_family_relationship_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention: {
        Row: {
          child_id: number
          date_created: string
          id: number
          intervention: string
          last_updated: string
          remarks: string | null
          service_category_id: number
          status: Database["public"]["Enums"]["improvement_status_enum"] | null
        }
        Insert: {
          child_id: number
          date_created?: string
          id?: number
          intervention: string
          last_updated: string
          remarks?: string | null
          service_category_id: number
          status?: Database["public"]["Enums"]["improvement_status_enum"] | null
        }
        Update: {
          child_id?: number
          date_created?: string
          id?: number
          intervention?: string
          last_updated?: string
          remarks?: string | null
          service_category_id?: number
          status?: Database["public"]["Enums"]["improvement_status_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "intervention_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          admission_date: string | null
          barangay_id: number | null
          birthday: string | null
          date_created: string | null
          first_name: string
          id: number
          last_approved: string | null
          last_name: string | null
          last_updated: string | null
          middle_name: string | null
          sex: Database["public"]["Enums"]["sex_enum"] | null
          street_id: number | null
        }
        Insert: {
          admission_date?: string | null
          barangay_id?: number | null
          birthday?: string | null
          date_created?: string | null
          first_name: string
          id?: number
          last_approved?: string | null
          last_name?: string | null
          last_updated?: string | null
          middle_name?: string | null
          sex?: Database["public"]["Enums"]["sex_enum"] | null
          street_id?: number | null
        }
        Update: {
          admission_date?: string | null
          barangay_id?: number | null
          birthday?: string | null
          date_created?: string | null
          first_name?: string
          id?: number
          last_approved?: string | null
          last_name?: string | null
          last_updated?: string | null
          middle_name?: string | null
          sex?: Database["public"]["Enums"]["sex_enum"] | null
          street_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "members_barangay_id_fkey"
            columns: ["barangay_id"]
            isOneToOne: false
            referencedRelation: "barangays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_street_id_fkey"
            columns: ["street_id"]
            isOneToOne: false
            referencedRelation: "streets"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_annual_renewal: {
        Row: {
          annual_program_id: number
          date_created: string
          family_id: number
          id: number
          last_updated: string
          remarks: string | null
          total_amount_due: number
        }
        Insert: {
          annual_program_id: number
          date_created?: string
          family_id: number
          id?: never
          last_updated?: string
          remarks?: string | null
          total_amount_due: number
        }
        Update: {
          annual_program_id?: number
          date_created?: string
          family_id?: number
          id?: never
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
            foreignKeyName: "membership_annual_renewal_family_id_fkey"
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
          family_id: number
          id: number
          remarks: string | null
        }
        Insert: {
          amount_paid?: number | null
          annual_program_id: number
          date_created?: string
          date_paid?: string | null
          family_id: number
          id?: never
          remarks?: string | null
        }
        Update: {
          amount_paid?: number | null
          annual_program_id?: number
          date_created?: string
          date_paid?: string | null
          family_id?: number
          id?: never
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_payment_annual_program_id_fkey"
            columns: ["annual_program_id"]
            isOneToOne: false
            referencedRelation: "annual_program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_payment_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      philhealth_ids: {
        Row: {
          exp_date: string
          id: number
        }
        Insert: {
          exp_date: string
          id?: number
        }
        Update: {
          exp_date?: string
          id?: number
        }
        Relationships: []
      }
      pwd_ids: {
        Row: {
          expiry_date: string
          id: string
        }
        Insert: {
          expiry_date: string
          id: string
        }
        Update: {
          expiry_date?: string
          id?: string
        }
        Relationships: []
      }
      relationship_cc: {
        Row: {
          caregiver_id: number
          child_id: number
          relationship: string
        }
        Insert: {
          caregiver_id: number
          child_id?: number
          relationship: string
        }
        Update: {
          caregiver_id?: number
          child_id?: number
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationship_cc_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationship_cc_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
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
      social_protection_status: {
        Row: {
          child_id: number
          date_created: string
          id: number
          last_updated: string | null
          year_accessed: number | null
        }
        Insert: {
          child_id: number
          date_created?: string
          id?: number
          last_updated?: string | null
          year_accessed?: number | null
        }
        Update: {
          child_id?: number
          date_created?: string
          id?: number
          last_updated?: string | null
          year_accessed?: number | null
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
      streets: {
        Row: {
          id: number
          street: string
        }
        Insert: {
          id: number
          street: string
        }
        Update: {
          id?: number
          street?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
      sex_enum: "Male" | "Female" | "Other"
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
  public: {
    Enums: {
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
      sex_enum: ["Male", "Female", "Other"],
    },
  },
} as const
