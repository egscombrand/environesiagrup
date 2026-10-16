export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          resource: string
          resource_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          resource: string
          resource_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          resource?: string
          resource_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_pillars: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          services: string[]
          short_description: string | null
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          services?: string[]
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          services?: string[]
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          accent_color: string | null
          capability_description: string | null
          capability_title: string | null
          cover_image_path: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          email: string | null
          explorer_category: string | null
          explorer_description: string | null
          explorer_contribution: string | null
          explorer_focus: string[]
          explorer_image_path: string | null
          explorer_services: string[]
          explorer_role: string | null
          id: string
          legalitas: string[]
          lini: string | null
          logo_path: string | null
          name: string
          phone: string | null
          services: string[]
          short_description: string | null
          slug: string
          social_tiktok: string | null
          social_youtube: string | null
          sort_order: number
          status: string
          tagline: string | null
          updated_at: string
          website: string | null
        },
        Insert: {
          accent_color?: string | null
          capability_description?: string | null
          capability_title?: string | null
          cover_image_path?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          email?: string | null
          explorer_category?: string | null
          explorer_description?: string | null
          explorer_contribution?: string | null
          explorer_focus?: string[]
          explorer_image_path?: string | null
          explorer_services?: string[]
          explorer_role?: string | null
          id?: string
          legalitas?: string[]
          lini?: string | null
          logo_path?: string | null
          name: string
          phone?: string | null
          services?: string[]
          short_description?: string | null
          slug: string
          social_tiktok?: string | null
          social_youtube?: string | null
          sort_order?: number
          status?: string
          tagline?: string | null
          updated_at?: string
          website?: string | null
        },
        Update: {
          accent_color?: string | null
          capability_description?: string | null
          capability_title?: string | null
          cover_image_path?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          email?: string | null
          explorer_category?: string | null
          explorer_description?: string | null
          explorer_contribution?: string | null
          explorer_focus?: string[]
          explorer_image_path?: string | null
          explorer_services?: string[]
          explorer_role?: string | null
          id?: string
          legalitas?: string[]
          lini?: string | null
          logo_path?: string | null
          name?: string
          phone?: string | null
          services?: string[]
          short_description?: string | null
          slug?: string
          social_tiktok?: string | null
          social_youtube?: string | null
          sort_order?: number
          status?: string
          tagline?: string | null
          updated_at?: string
          website?: string | null
        },
        Relationships: []
      }
      hero_slides: {
        Row: {
          accent_color: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          description: string | null
          desktop_image_path: string | null
          duration_seconds: number | null
          eyebrow: string | null
          id: string
          mobile_image_path: string | null
          secondary_cta_label: string | null
          secondary_cta_url: string | null
          sort_order: number
          status: string
          subtitle: string | null
          title: string
          type: string
          updated_at: string
          video_poster_path: string | null
          video_url: string | null
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          desktop_image_path?: string | null
          duration_seconds?: number | null
          eyebrow?: string | null
          id?: string
          mobile_image_path?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          sort_order?: number
          status?: string
          subtitle?: string | null
          title: string
          type?: string
          updated_at?: string
          video_poster_path?: string | null
          video_url?: string | null
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          desktop_image_path?: string | null
          duration_seconds?: number | null
          eyebrow?: string | null
          id?: string
          mobile_image_path?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          sort_order?: number
          status?: string
          subtitle?: string | null
          title?: string
          type?: string
          updated_at?: string
          video_poster_path?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      import_batches: {
        Row: {
          created_at: string
          id: string
          imported_by: string | null
          imported_count: number
          projects_found: number
          source_document: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          imported_by?: string | null
          imported_count?: number
          projects_found?: number
          source_document: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          imported_by?: string | null
          imported_count?: number
          projects_found?: number
          source_document?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          client_name: string
          created_at: string
          id: string
          logo_path: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          client_name: string
          created_at?: string
          id?: string
          logo_path?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          client_name?: string
          created_at?: string
          id?: string
          logo_path?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      legal_cards: {
        Row: {
          category: string
          created_at: string
          entity_id: string
          id: string
          intro: Json
          logo: string | null
          logo_alt: string
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          entity_id: string
          id: string
          intro?: Json
          logo?: string | null
          logo_alt: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          entity_id?: string
          id?: string
          intro?: Json
          logo?: string | null
          logo_alt?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          card_id: string
          cta_label: string | null
          created_at: string
          description: string | null
          document_type: string | null
          document_url: string | null
          external_url: string | null
          fields: Json
          id: string
          issuer: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          card_id: string
          cta_label?: string | null
          created_at?: string
          description?: string | null
          document_type?: string | null
          document_url?: string | null
          external_url?: string | null
          fields?: Json
          id: string
          issuer?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          card_id?: string
          cta_label?: string | null
          created_at?: string
          description?: string | null
          document_type?: string | null
          document_url?: string | null
          external_url?: string | null
          fields?: Json
          id?: string
          issuer?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      legal_entities: {
        Row: {
          created_at: string
          id: string
          legal_name: string | null
          name: string
          short_name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          legal_name?: string | null
          name: string
          short_name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          legal_name?: string | null
          name?: string
          short_name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          images: Json
          created_at: string
          description: string | null
          description_en: string | null
          description_zh: string | null
          extra_label: string | null
          extra_label_en: string | null
          extra_label_zh: string | null
          extra_text: string | null
          extra_text_en: string | null
          extra_text_zh: string | null
          eyebrow: string | null
          eyebrow_en: string | null
          eyebrow_zh: string | null
          id: string
          image_mobile_path: string | null
          image_path: string | null
          items: Json
          items_en: Json
          items_zh: Json
          meta_description: string | null
          meta_description_en: string | null
          meta_description_zh: string | null
          meta_title: string | null
          meta_title_en: string | null
          meta_title_zh: string | null
          section_group: string
          slug: string
          sort_order: number
          status: string
          steps: Json
          steps_en: Json
          steps_zh: Json
          tags: Json
          tags_en: Json
          tags_zh: Json
          title: string
          title_en: string | null
          title_zh: string | null
          updated_at: string
        },
        Insert: {
          images?: Json
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_zh?: string | null
          extra_label?: string | null
          extra_label_en?: string | null
          extra_label_zh?: string | null
          extra_text?: string | null
          extra_text_en?: string | null
          extra_text_zh?: string | null
          eyebrow?: string | null
          eyebrow_en?: string | null
          eyebrow_zh?: string | null
          id?: string
          image_mobile_path?: string | null
          image_path?: string | null
          items?: Json
          items_en?: Json
          items_zh?: Json
          meta_description?: string | null
          meta_description_en?: string | null
          meta_description_zh?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          meta_title_zh?: string | null
          section_group: string
          slug: string
          sort_order?: number
          status?: string
          steps?: Json
          steps_en?: Json
          steps_zh?: Json
          tags?: Json
          tags_en?: Json
          tags_zh?: Json
          title: string
          title_en?: string | null
          title_zh?: string | null
          updated_at?: string
        },
        Update: {
          images?: Json
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_zh?: string | null
          extra_label?: string | null
          extra_label_en?: string | null
          extra_label_zh?: string | null
          extra_text?: string | null
          extra_text_en?: string | null
          extra_text_zh?: string | null
          eyebrow?: string | null
          eyebrow_en?: string | null
          eyebrow_zh?: string | null
          id?: string
          image_mobile_path?: string | null
          image_path?: string | null
          items?: Json
          items_en?: Json
          items_zh?: Json
          meta_description?: string | null
          meta_description_en?: string | null
          meta_description_zh?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          meta_title_zh?: string | null
          section_group?: string
          slug?: string
          sort_order?: number
          status?: string
          steps?: Json
          steps_en?: Json
          steps_zh?: Json
          tags?: Json
          tags_en?: Json
          tags_zh?: Json
          title?: string
          title_en?: string | null
          title_zh?: string | null
          updated_at?: string
        },
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          created_by: string | null
          deadline: string | null
          deleted_at: string | null
          division: string | null
          open_date: string | null
          cover_image_path: string | null
          general_recruitment: string | null
          specific_recruitment: string | null
          google_form_url: string | null
          employment_type: string | null
          entity_id: string | null
          id: string
          location: string | null
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          deleted_at?: string | null
          division?: string | null
          open_date?: string | null
          cover_image_path?: string | null
          general_recruitment?: string | null
          specific_recruitment?: string | null
          google_form_url?: string | null
          employment_type?: string | null
          entity_id?: string | null
          id?: string
          location?: string | null
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          deleted_at?: string | null
          division?: string | null
          open_date?: string | null
          cover_image_path?: string | null
          general_recruitment?: string | null
          specific_recruitment?: string | null
          google_form_url?: string | null
          employment_type?: string | null
          entity_id?: string | null
          id?: string
          location?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      leadership: {
        Row: {
          profile: Json
          bio: string | null
          created_at: string
          entity_id: string | null
          id: string
          name: string
          photo_path: string | null
          position: string
          slug: string
          sort_order: number
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          profile?: Json
          bio?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          name: string
          photo_path?: string | null
          position: string
          slug: string
          sort_order?: number
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          profile?: Json
          bio?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          name?: string
          photo_path?: string | null
          position?: string
          slug?: string
          sort_order?: number
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leadership_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          alt_text: string | null
          bucket: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          folder: string | null
          id: string
          path: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          bucket?: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          folder?: string | null
          id?: string
          path: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          bucket?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          folder?: string | null
          id?: string
          path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          date_label: string | null
          description: string | null
          id: string
          image_path: string | null
          sort_order: number
          status: string
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          date_label?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          date_label?: string | null
          description?: string | null
          id?: string
          image_path?: string | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          id: string
          label: string
          label_en: string | null
          label_zh: string | null
          menu: string
          open_new_tab: boolean
          parent_id: string | null
          slug: string | null
          sort_order: number
          status: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          label_en?: string | null
          label_zh?: string | null
          menu?: string
          open_new_tab?: boolean
          parent_id?: string | null
          slug?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          label_en?: string | null
          label_zh?: string | null
          menu?: string
          open_new_tab?: boolean
          parent_id?: string | null
          slug?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          config: Json
          created_at: string
          id: string
          page_id: string
          section_key: string
          sort_order: number
          status: string
          subtitle_override: string | null
          title_override: string | null
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          page_id: string
          section_key: string
          sort_order?: number
          status?: string
          subtitle_override?: string | null
          title_override?: string | null
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          page_id?: string
          section_key?: string
          sort_order?: number
          status?: string
          subtitle_override?: string | null
          title_override?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pillar_entities: {
        Row: {
          entity_id: string
          pillar_id: string
        }
        Insert: {
          entity_id: string
          pillar_id: string
        }
        Update: {
          entity_id?: string
          pillar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pillar_entities_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "business_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          cover_image_path: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt: string | null
          featured: boolean
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
          media: string | null
          needs_review: boolean
          owner: string | null
          source_url: string | null
          thumbnail_source: string | null
          thumbnail_source_url: string | null
          thumbnail_status: string | null
          thumbnail_url: string | null
          thumbnail_detection_method: string | null
          thumbnail_error_reason: string | null
          thumbnail_extractor_version: number | null
          post_type: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          media?: string | null
          needs_review?: boolean
          owner?: string | null
          source_url?: string | null
          thumbnail_source?: string | null
          thumbnail_source_url?: string | null
          thumbnail_status?: string | null
          thumbnail_url?: string | null
          thumbnail_detection_method?: string | null
          thumbnail_error_reason?: string | null
          thumbnail_extractor_version?: number | null
          post_type?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          media?: string | null
          needs_review?: boolean
          owner?: string | null
          source_url?: string | null
          thumbnail_source?: string | null
          thumbnail_source_url?: string | null
          thumbnail_status?: string | null
          thumbnail_url?: string | null
          thumbnail_detection_method?: string | null
          thumbnail_error_reason?: string | null
          thumbnail_extractor_version?: number | null
          post_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      project_entities: {
        Row: {
          entity_id: string
          project_id: string
        }
        Insert: {
          entity_id: string
          project_id: string
        }
        Update: {
          entity_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_entities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_entities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_path: string
          project_id: string
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_path: string
          project_id: string
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_path?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          city: string | null
          client: string | null
          client_anonymous: boolean
          client_descriptor: string | null
          company: string | null
          confidence: string | null
          content: string | null
          country: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          extraction_method: string | null
          featured_image_path: string | null
          id: string
          import_batch_id: string | null
          latitude: number | null
          longitude: number | null
          published_at: string | null
          sector: string | null
          services: string | null
          slug: string
          sort_order: number
          source_document: string | null
          source_page: number | null
          status: string
          summary: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          city?: string | null
          client?: string | null
          client_anonymous?: boolean
          client_descriptor?: string | null
          company?: string | null
          confidence?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          extraction_method?: string | null
          featured_image_path?: string | null
          id?: string
          import_batch_id?: string | null
          latitude?: number | null
          longitude?: number | null
          published_at?: string | null
          sector?: string | null
          services?: string | null
          slug: string
          sort_order?: number
          source_document?: string | null
          source_page?: number | null
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          city?: string | null
          client?: string | null
          client_anonymous?: boolean
          client_descriptor?: string | null
          company?: string | null
          confidence?: string | null
          content?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          extraction_method?: string | null
          featured_image_path?: string | null
          id?: string
          import_batch_id?: string | null
          latitude?: number | null
          longitude?: number | null
          published_at?: string | null
          sector?: string | null
          services?: string | null
          slug?: string
          sort_order?: number
          source_document?: string | null
          source_page?: number | null
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_import_batch_id_fkey"
            columns: ["import_batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string | null
          capabilities_subtext: string | null
          ecosystem_closing_cta_label: string | null
          ecosystem_closing_heading: string | null
          ecosystem_closing_subtext: string | null
          ecosystem_discovery_intro_1: string | null
          ecosystem_discovery_intro_2: string | null
          ecosystem_eyebrow: string | null
          ecosystem_opening_cta_label: string | null
          ecosystem_opening_question: string | null
          ecosystem_opening_statement_1: string | null
          ecosystem_opening_statement_2: string | null
          email: string | null
          favicon_path: string | null
          footer_copyright: string | null
          footer_description: string | null
          footer_links: Json
          google_maps_url: string | null
          id: number
          logo_path: string | null
          map_url: string | null
          milestones_eyebrow: string | null
          milestones_intro: string | null
          phone: string | null
          seo_default_description: string | null
          seo_default_og_image: string | null
          seo_default_title: string | null
          seo_keywords: string | null
          seo_robots: string
          site_name: string
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_youtube: string | null
          tagline: string | null
          updated_at: string
          updated_by: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          capabilities_subtext?: string | null
          ecosystem_closing_cta_label?: string | null
          ecosystem_closing_heading?: string | null
          ecosystem_closing_subtext?: string | null
          ecosystem_discovery_intro_1?: string | null
          ecosystem_discovery_intro_2?: string | null
          ecosystem_eyebrow?: string | null
          ecosystem_opening_cta_label?: string | null
          ecosystem_opening_question?: string | null
          ecosystem_opening_statement_1?: string | null
          ecosystem_opening_statement_2?: string | null
          email?: string | null
          favicon_path?: string | null
          footer_copyright?: string | null
          footer_description?: string | null
          footer_links?: Json
          google_maps_url?: string | null
          id?: number
          logo_path?: string | null
          map_url?: string | null
          milestones_eyebrow?: string | null
          milestones_intro?: string | null
          phone?: string | null
          seo_default_description?: string | null
          seo_default_og_image?: string | null
          seo_default_title?: string | null
          seo_keywords?: string | null
          seo_robots?: string
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          capabilities_subtext?: string | null
          ecosystem_closing_cta_label?: string | null
          ecosystem_closing_heading?: string | null
          ecosystem_closing_subtext?: string | null
          ecosystem_discovery_intro_1?: string | null
          ecosystem_discovery_intro_2?: string | null
          ecosystem_eyebrow?: string | null
          ecosystem_opening_cta_label?: string | null
          ecosystem_opening_question?: string | null
          ecosystem_opening_statement_1?: string | null
          ecosystem_opening_statement_2?: string | null
          email?: string | null
          favicon_path?: string | null
          footer_copyright?: string | null
          footer_description?: string | null
          footer_links?: Json
          google_maps_url?: string | null
          id?: number
          logo_path?: string | null
          map_url?: string | null
          milestones_eyebrow?: string | null
          milestones_intro?: string | null
          phone?: string | null
          seo_default_description?: string | null
          seo_default_og_image?: string | null
          seo_default_title?: string | null
          seo_keywords?: string | null
          seo_robots?: string
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          tagline?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stats: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          label: string
          prefix: string | null
          sort_order: number
          status: string
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          label: string
          prefix?: string | null
          sort_order?: number
          status?: string
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          label?: string
          prefix?: string | null
          sort_order?: number
          status?: string
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      story_scenes: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_url: string | null
          description: string | null
          entity_id: string
          headline: string | null
          id: string
          image_path: string | null
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          entity_id: string
          headline?: string | null
          id?: string
          image_path?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          entity_id?: string
          headline?: string | null
          id?: string
          image_path?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_scenes_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin_role: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      user_role: "super_admin" | "editor" | "author"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["super_admin", "editor", "author"],
    },
  },
} as const
