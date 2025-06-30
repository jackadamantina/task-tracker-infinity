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
      alert_configurations_lnk: {
        Row: {
          alert_type: string
          client_id: string
          created_at: string
          destination: string
          id: string
          is_active: boolean | null
          trigger_conditions: Json
          updated_at: string
        }
        Insert: {
          alert_type: string
          client_id: string
          created_at?: string
          destination: string
          id?: string
          is_active?: boolean | null
          trigger_conditions: Json
          updated_at?: string
        }
        Update: {
          alert_type?: string
          client_id?: string
          created_at?: string
          destination?: string
          id?: string
          is_active?: boolean | null
          trigger_conditions?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_configurations_lnk_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_lnk"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          id: string
          target: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          id?: string
          target?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          id?: string
          target?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adverso: string | null
          andamento: string | null
          cep: string | null
          complemento: string | null
          created_at: string | null
          data_audiencia: string | null
          data_verificacao: string | null
          endereco: string | null
          hora_audiencia: string | null
          id: string
          local: string | null
          nome: string
          numero: string | null
          processo: string
          status: string | null
          telefone: string | null
          updated_at: string | null
          vara: string | null
        }
        Insert: {
          adverso?: string | null
          andamento?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string | null
          data_audiencia?: string | null
          data_verificacao?: string | null
          endereco?: string | null
          hora_audiencia?: string | null
          id?: string
          local?: string | null
          nome: string
          numero?: string | null
          processo: string
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          vara?: string | null
        }
        Update: {
          adverso?: string | null
          andamento?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string | null
          data_audiencia?: string | null
          data_verificacao?: string | null
          endereco?: string | null
          hora_audiencia?: string | null
          id?: string
          local?: string | null
          nome?: string
          numero?: string | null
          processo?: string
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          vara?: string | null
        }
        Relationships: []
      }
      clients_lnk: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          plan_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          plan_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          plan_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      failed_login_attempts: {
        Row: {
          attempt_count: number
          blocked_until: string | null
          created_at: string
          first_attempt: string
          id: string
          ip_address: unknown
          last_attempt: string
          updated_at: string
          username: string | null
        }
        Insert: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          first_attempt?: string
          id?: string
          ip_address: unknown
          last_attempt?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          first_attempt?: string
          id?: string
          ip_address?: unknown
          last_attempt?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      google_ads_campaigns_lnk: {
        Row: {
          campaign_id: string
          campaign_name: string
          client_id: string
          created_at: string
          final_url_suffix: string | null
          id: string
          status: string
          tracking_template: string | null
          updated_at: string
        }
        Insert: {
          campaign_id: string
          campaign_name: string
          client_id: string
          created_at?: string
          final_url_suffix?: string | null
          id?: string
          status: string
          tracking_template?: string | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          campaign_name?: string
          client_id?: string
          created_at?: string
          final_url_suffix?: string | null
          id?: string
          status?: string
          tracking_template?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "google_ads_campaigns_lnk_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_lnk"
            referencedColumns: ["id"]
          },
        ]
      }
      imported_users_idm: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          id: string
          imported_at: string
          name: string
          status: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          imported_at?: string
          name: string
          status?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          id?: string
          imported_at?: string
          name?: string
          status?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      link_audit_history_lnk: {
        Row: {
          check_timestamp: string
          error_message: string | null
          error_type: string | null
          http_status_code: number | null
          id: string
          link_id: string
          redirect_chain: Json | null
          response_time_ms: number | null
          utm_validation: Json | null
        }
        Insert: {
          check_timestamp?: string
          error_message?: string | null
          error_type?: string | null
          http_status_code?: number | null
          id?: string
          link_id: string
          redirect_chain?: Json | null
          response_time_ms?: number | null
          utm_validation?: Json | null
        }
        Update: {
          check_timestamp?: string
          error_message?: string | null
          error_type?: string | null
          http_status_code?: number | null
          id?: string
          link_id?: string
          redirect_chain?: Json | null
          response_time_ms?: number | null
          utm_validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "link_audit_history_lnk_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "monitored_links_lnk"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_ads_campaigns_lnk: {
        Row: {
          campaign_id: string
          campaign_name: string
          client_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          campaign_id: string
          campaign_name: string
          client_id: string
          created_at?: string
          id?: string
          status: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          campaign_id?: string
          campaign_name?: string
          client_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meta_ads_campaigns_lnk_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_lnk"
            referencedColumns: ["id"]
          },
        ]
      }
      monitored_links_lnk: {
        Row: {
          client_id: string
          created_at: string
          http_status_code: number | null
          id: string
          last_check_at: string | null
          response_time_ms: number | null
          source_id: string | null
          source_type: string
          status: string | null
          updated_at: string
          url: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          http_status_code?: number | null
          id?: string
          last_check_at?: string | null
          response_time_ms?: number | null
          source_id?: string | null
          source_type: string
          status?: string | null
          updated_at?: string
          url: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          http_status_code?: number | null
          id?: string
          last_check_at?: string | null
          response_time_ms?: number | null
          source_id?: string | null
          source_type?: string
          status?: string | null
          updated_at?: string
          url?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monitored_links_lnk_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_lnk"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          created_at: string
          id: string
          organization_name: string
          password_policy: Json | null
          session_timeout_minutes: number | null
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_name?: string
          password_policy?: Json | null
          session_timeout_minutes?: number | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_name?: string
          password_policy?: Json | null
          session_timeout_minutes?: number | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_users_idm: {
        Row: {
          created_at: string
          email: string | null
          id: string
          imported_at: string
          name: string | null
          system_id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          imported_at?: string
          name?: string | null
          system_id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          imported_at?: string
          name?: string | null
          system_id?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_users_idm_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems_idm"
            referencedColumns: ["id"]
          },
        ]
      }
      systems_idm: {
        Row: {
          access_type: string | null
          created_at: string
          created_by: string | null
          description: string | null
          hosting: string | null
          id: string
          integrated_users: boolean | null
          integration_type: string | null
          log_types: Json | null
          logs_status: string | null
          mfa_configuration: string | null
          mfa_policy: string | null
          mfa_sms_policy: string | null
          name: string
          named_users: boolean | null
          offboarding_priority: string | null
          offboarding_type: string | null
          onboarding_type: string | null
          password_complexity: string | null
          region_blocking: string | null
          responsible: string | null
          sso_configuration: string | null
          updated_at: string
          url: string | null
          user_management_responsible: string | null
          version: string | null
        }
        Insert: {
          access_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          hosting?: string | null
          id?: string
          integrated_users?: boolean | null
          integration_type?: string | null
          log_types?: Json | null
          logs_status?: string | null
          mfa_configuration?: string | null
          mfa_policy?: string | null
          mfa_sms_policy?: string | null
          name: string
          named_users?: boolean | null
          offboarding_priority?: string | null
          offboarding_type?: string | null
          onboarding_type?: string | null
          password_complexity?: string | null
          region_blocking?: string | null
          responsible?: string | null
          sso_configuration?: string | null
          updated_at?: string
          url?: string | null
          user_management_responsible?: string | null
          version?: string | null
        }
        Update: {
          access_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          hosting?: string | null
          id?: string
          integrated_users?: boolean | null
          integration_type?: string | null
          log_types?: Json | null
          logs_status?: string | null
          mfa_configuration?: string | null
          mfa_policy?: string | null
          mfa_sms_policy?: string | null
          name?: string
          named_users?: boolean | null
          offboarding_priority?: string | null
          offboarding_type?: string | null
          onboarding_type?: string | null
          password_complexity?: string | null
          region_blocking?: string | null
          responsible?: string | null
          sso_configuration?: string | null
          updated_at?: string
          url?: string | null
          user_management_responsible?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "systems_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_idm"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_mfa_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "temp_mfa_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_idm"
            referencedColumns: ["id"]
          },
        ]
      }
      user_idm: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          password: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          password: string
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          password?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_import_files_idm: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          id: string
          import_date: string
          imported_by: string | null
          processed_records: number | null
          status: string | null
          total_records: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          id?: string
          import_date?: string
          imported_by?: string | null
          processed_records?: number | null
          status?: string | null
          total_records?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          id?: string
          import_date?: string
          imported_by?: string | null
          processed_records?: number | null
          status?: string | null
          total_records?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_import_files_idm_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "user_idm"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mfa_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_verified: boolean | null
          mfa_enabled: boolean
          mfa_type: string | null
          phone_number: string | null
          secret_key: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          mfa_enabled?: boolean
          mfa_type?: string | null
          phone_number?: string | null
          secret_key?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          mfa_enabled?: boolean
          mfa_type?: string | null
          phone_number?: string | null
          secret_key?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          password: string
          role: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password: string
          role?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password?: string
          role?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      website_domains_lnk: {
        Row: {
          broken_links: number | null
          client_id: string
          created_at: string
          domain: string
          healthy_links: number | null
          id: string
          is_active: boolean | null
          last_crawl_at: string | null
          total_links_found: number | null
          updated_at: string
        }
        Insert: {
          broken_links?: number | null
          client_id: string
          created_at?: string
          domain: string
          healthy_links?: number | null
          id?: string
          is_active?: boolean | null
          last_crawl_at?: string | null
          total_links_found?: number | null
          updated_at?: string
        }
        Update: {
          broken_links?: number | null
          client_id?: string
          created_at?: string
          domain?: string
          healthy_links?: number | null
          id?: string
          is_active?: boolean | null
          last_crawl_at?: string | null
          total_links_found?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_domains_lnk_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_lnk"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_idm_user: {
        Args: { p_email: string; p_password: string }
        Returns: {
          user_id: string
          email: string
          username: string
          full_name: string
          role: string
          success: boolean
        }[]
      }
      authenticate_user: {
        Args: { p_username: string; p_password: string }
        Returns: {
          user_id: string
          username: string
          role: string
          success: boolean
        }[]
      }
      generate_mfa_code: {
        Args: { p_user_id: string }
        Returns: string
      }
      validate_password_policy: {
        Args: { p_password: string }
        Returns: {
          is_valid: boolean
          errors: string[]
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
