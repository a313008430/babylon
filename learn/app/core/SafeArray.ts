/**
 * 数组管理
 */
export default class SafeArray {
    /** 对象列表 */
    private array: any[];
    /** 添加的对象列表 */
    private addQueue: any[];
    /** 缓存临时删除的数据列表 */
    private removeQueue: Set<any>;

    constructor() {
        this.array = [];
        this.addQueue = [];
        this.removeQueue = new Set();
    }

    /** 缓存数组是否为空 */
    get isEmpty() {
        return this.addQueue.length + this.array.length > 0;
    }

    add<T>(element:T) {
        this.addQueue.push(element);
    }

    remove(element) {
        this.removeQueue.add(element);
    }

    forEach(fn: Function) {
        this.addQueued();
        this.removeQueued();
        for (const element of this.array) {
            if (this.removeQueue.has(element)) {
                continue;
            }
            fn(element);
        }
    }

    private addQueued() {
        if (this.addQueue.length) {
            this.array.splice(this.array.length, 0, ...this.addQueue);
        }
    }

    private removeQueued() {
        if (this.removeQueue.size) {
            this.array = this.array.filter(element => !this.removeQueue.has(element));
            this.removeQueue.clear();
        }
    }
}