// @ts-check
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import typescriptEslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
);
