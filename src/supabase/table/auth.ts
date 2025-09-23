import supabase from "../supabase-client";

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
};


const authService = new AuthService();

export default authService;