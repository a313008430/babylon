import EventDispatcher from './EventDispatcher';

/**
 * 核心模块入口
 */

export { default as INode } from './INode';
export { default as IButton } from './IButton';
export { default as IImage } from './IImage';
export { default as IControl } from './IControl';
export { default as Component } from './Component';
export const Event = new EventDispatcher();

