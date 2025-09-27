const typescriptParser = require('@typescript-eslint/parser');
const n8nNodesBase = require('eslint-plugin-n8n-nodes-base');

module.exports = [
	{
		ignores: ['node_modules/**', 'dist/**', '.eslintrc.js', '**/*.js', 'eslint.config.js'],
	},
	{
		files: ['**/*.ts', 'package.json'],
		languageOptions: {
			parser: typescriptParser,
			ecmaVersion: 2020,
			sourceType: 'module',
			parserOptions: {
				project: ['./tsconfig.json'],
				extraFileExtensions: ['.json'],
			},
		},
	},
	{
		files: ['package.json'],
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			...n8nNodesBase.configs.community.rules,
			'n8n-nodes-base/community-package-json-name-still-default': 'off',
		},
	},
	{
		files: ['credentials/**/*.ts'],
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			...n8nNodesBase.configs.credentials.rules,
			'n8n-nodes-base/cred-class-field-documentation-url-not-http-url': 'off',
			'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
		},
	},
	{
		files: ['nodes/**/*.ts'],
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			...n8nNodesBase.configs.nodes.rules,
			'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
			'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
		},
	},
];