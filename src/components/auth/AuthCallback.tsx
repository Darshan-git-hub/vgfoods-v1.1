import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionAndProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        toast.error('Error checking session: ' + sessionError.message);
        navigate('/signin');
        return;
      }

      if (session) {
        const user = session.user;
        if (user) {
          // Check if profile exists, create if not
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            toast.error('Error checking profile: ' + profileError.message);
            navigate('/signin');
            return;
          }

          if (!profile) {
            // Create initial profile with Google data
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Google User',
                email: user.email,
                phone: null,
                address: null,
                created_at: new Date().toISOString(),
                role: 'user'
              });

            if (insertError) {
              toast.error('Error creating profile: ' + insertError.message);
              navigate('/signin');
              return;
            }
          }

          // Always redirect to complete-profile after Google login
          setTimeout(() => {
            toast.success('Please complete your profile');
            navigate('/complete-profile');
          }, 1000);
        }
      } else {
        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (event === 'SIGNED_IN' && newSession) {
            const user = newSession.user;
            if (user) {
              supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single()
                .then(({ data: profile, error: profileError }) => {
                  if (profileError && profileError.code !== 'PGRST116') {
                    toast.error('Error checking profile: ' + profileError.message);
                    navigate('/signin');
                    return;
                  }

                  if (!profile) {
                    supabase
                      .from('profiles')
                      .insert({
                        id: user.id,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Google User',
                        email: user.email,
                        phone: null,
                        address: null,
                        created_at: new Date().toISOString(),
                        role: 'user'
                      })
                      .then(({ error: insertError }) => {
                        if (insertError) {
                          toast.error('Error creating profile: ' + insertError.message);
                          navigate('/signin');
                        } else {
                          setTimeout(() => {
                            toast.success('Please complete your profile');
                            navigate('/complete-profile');
                          }, 1000);
                        }
                      });
                  } else {
                    setTimeout(() => {
                      toast.success('Please complete your profile');
                      navigate('/complete-profile');
                    }, 1000);
                  }
                });
            }
          }
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      }
    };

    checkSessionAndProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Completing sign in...
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;