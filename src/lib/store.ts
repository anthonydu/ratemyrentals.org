import { persisted } from 'svelte-persisted-store';

export const searchFilter = persisted('searchFilter', '%');

export const searchQuery = persisted('searchQuery', '');
