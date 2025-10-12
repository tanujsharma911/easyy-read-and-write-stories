import supabase from "./supabase-client";
import { toast } from "sonner"

// interface UserData {
//     aud: string;
//     created_at: string;
//     email: string | undefined;
//     email_confirmed_at: string | null;
//     id: string;
//     last_sign_in_at: string;
//     phone: string | null;
//     phone_confirmed_at: string | null;
//     role: string;
//     updated_at: string;
//     user_metadata: {
//       avatar_url?: string | undefined;
//       full_name?: string | undefined;
//       avatar?: string | undefined;
//       [key: string]: string | undefined; // For any additional metadata fields
//     };
//   }
export class AuthService {
    async signInWithGoogle() {
        try {

            const redirectTo =
                process.env.NODE_ENV === "production"
                    ? "https://easyy.vercel.app"
                    : "http://localhost:5173";

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { 
                    redirectTo: redirectTo
                 }
            });
              
    
            if (error) {
                console.error('Error during Google sign-in:', error.message);
                throw new Error(error.message);
            }

            // console.log('Google sign-in data:', data);

            return data;
            
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            throw new Error("Error signing in with Google: " + error);
        }
        
    }

    async getSession() {
        const session = await supabase.auth.getSession();
        if (session) {
            return session.data.session?.user;
        } else {
            return null;
        }
    }

    async userLoggedin(userId: string) {
        // console.log("User logged in:", userData);
        try {
            const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", userId);

            if(error)
                throw new Error("Error fetching user data: " + error.message);

            return data;
            
        } catch (error) {
            console.error("Error in userLoggedin:", error);
            throw new Error("Error in userLoggedin: " + error);
        }
    }
    
    async signOut() {
        
        const { error } = await supabase.auth.signOut();

        if (error) {
            return ({ status: 'error', msg: error.message });
        } else {
            toast.success("Successfully Logged Out", {
                description: "You have successfully logged out"
            });
            return ({ status: 'success', msg: 'Sign out successful!' });
        };
    }
};


const authService = new AuthService();

export default authService;