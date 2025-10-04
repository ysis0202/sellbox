// Supabase 데이터베이스 타입 정의

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          owner_id: string
          name: string
          handle: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          handle: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          handle?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          store_id: string
          order_no: string
          buyer_name: string | null
          buyer_phone: string | null
          buyer_email: string | null
          zipcode: string | null
          address1: string | null
          address2: string | null
          note: string | null
          items_json: Json | null
          amount: number
          status: string
          proof_image_url: string | null
          ship_courier: string | null
          ship_tracking_no: string | null
          ship_photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          order_no: string
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_email?: string | null
          zipcode?: string | null
          address1?: string | null
          address2?: string | null
          note?: string | null
          items_json?: Json | null
          amount?: number
          status?: string
          proof_image_url?: string | null
          ship_courier?: string | null
          ship_tracking_no?: string | null
          ship_photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          order_no?: string
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_email?: string | null
          zipcode?: string | null
          address1?: string | null
          address2?: string | null
          note?: string | null
          items_json?: Json | null
          amount?: number
          status?: string
          proof_image_url?: string | null
          ship_courier?: string | null
          ship_tracking_no?: string | null
          ship_photo_url?: string | null
          created_at?: string
        }
      }
    }
  }
}

// 편의 타입
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Store = Database['public']['Tables']['stores']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

