import type { InjectionKey, Ref } from 'vue';
import type { IUser } from '@/types/user';

export const UserKey: InjectionKey<Ref<IUser | undefined>> = Symbol('user');
