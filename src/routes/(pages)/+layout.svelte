<script>
	import '../../app.css';
	import { supabase } from '$lib/supabase';
	import { user } from '$lib/store';

	supabase.auth.refreshSession().then(({ data }) => user.set(data.user));
</script>

<slot />
