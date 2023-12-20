import type { User } from '@supabase/supabase-js';
import { persisted } from 'svelte-persisted-store';

export const searchFilter = persisted('searchFilter', '%');

export const searchQuery = persisted('searchQuery', '');

export const user = persisted<User | null>('user', null);
