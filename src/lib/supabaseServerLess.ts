import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseServerLessURL = process.env.EXPO_PUBLIC_SUPABASE_SERVERLESS_URL!;
const supabaseServerLessAnonKey = process.env.EXPO_PUBLIC_SUPABASE_SERVERLESS_ANON_KEY!;

export const supabaseServerLess = createClient(supabaseServerLessURL, supabaseServerLessAnonKey)

