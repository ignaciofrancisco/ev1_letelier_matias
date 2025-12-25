import { TextInput, View, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <View className="mb-4 flex-row items-center rounded-xl bg-white px-4 py-2 shadow-sm shadow-black/5">
      <IconSymbol size={20} name="magnifyingglass" color="#94a3b8" />
      <TextInput
        className="ml-3 flex-1 text-base text-slate-900"
        placeholder="Buscar tareas..."
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')}>
          <IconSymbol size={16} name="xmark.circle.fill" color="#cbd5e1" />
        </Pressable>
      )}
    </View>
  );
};
