/**
 * WordPress global type definitions.
 * @module wp-globals
 */

declare module '@wordpress/element' {
	export function useState<T>( initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
	export function useCallback<T extends (...args: any[]) => any>( callback: T, deps: any[]): T;
	export function useMemo<T>( factory: () => T, deps: any[]): T;
	export function useEffect( effect: () => void | (() => void), deps?: any[]): void;
	export function useRef<T>( initial: T): { current: T };
	export const Fragment: React.ComponentType;
}

declare module '@wordpress/i18n' {
	export function __( text: string, domain?: string): string;
	export function _x( text: string, context: string, domain?: string): string;
	export function _n( single: string, plural: string, number: number, domain?: string): string;
	export function sprintf( format: string, ...args: any[]): string;
}

declare module '@wordpress/data' {
	export function useSelect<T>( selector: (select: Function) => T, deps?: any[]): T;
	export function useDispatch( store: string): (...args: any[]) => void;
	export function registerStore( name: string, options: any): void;
}

declare module '@wordpress/api-fetch' {
	export function apiFetch( options: {
		path?: string;
		method?: string;
		data?: any;
		headers?: Record<string, string>;
	}): Promise<any>;
	export default apiFetch;
}

declare module '@wordpress/components' {
	export const TextControl: React.FC<any>;
	export const SelectControl: React.FC<any>;
	export const PanelRow: React.FC<any>;
	export const Button: React.FC<any>;
	export const Modal: React.FC<any>;
	export const Spinner: React.FC<any>;
	export const ToggleControl: React.FC<any>;
}

declare module '@wordpress/edit-post' {
	export const PluginDocumentSettingPanel: React.FC<any>;
}

declare module '@wordpress/plugins' {
	export function registerPlugin( name: string, settings: {
		render: React.FC;
		icon?: string;
	}): void;
}

declare module '@wordpress/icons' {
	export const icon: any;
}

declare module '@wordpress/primitives' {
	export const SVG: React.FC<any>;
	export const Circle: React.FC<any>;
	export const Path: React.FC<any>;
	export const Polygon: React.FC<any>;
	export const Rect: React.FC<any>;
	export const Line: React.FC<any>;
}

interface Window {
	lumoraData?: {
		nonce?: string;
		restUrl?: string;
		siteName?: string;
		adminUrl?: string;
		isRtl?: boolean;
		adminMenu?: Array<{
			id: string;
			icon: string;
			title: string;
			url: string;
			sub: Array<{
				title: string;
				url: string;
			}>;
		}>;
	};
}
