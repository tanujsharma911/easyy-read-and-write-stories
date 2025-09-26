import supabase from "./supabase-client";
import { toast } from "sonner"

export class AuthService {
    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
          

        if (error) {
            console.error('Error during Google sign-in:', error.message);
        } else {
            return data;
        }
    }

    async getSession() {
        const session = await supabase.auth.getSession();
        if (session) {
            return session.data.session;
        } else {
            return null;
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