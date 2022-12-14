export interface IClassConstructor<T> {
	new (): T;
	prototype: T;
}

const getType = (value: unknown = undefined): string => {
	const type: string = typeof value;
	switch (true) {
		case value === null:
			return 'null';
		case type === 'object' && Array.isArray(value):
			return 'array';
		default:
			return type;
	}
};

const isType = <T>(type: string) => (value: unknown): value is T => getType(value) === type;
const isInstanceOf = <T>(instance: IClassConstructor<T>) => (value: unknown): value is T => value instanceof instance;

export const IsArray: (value: unknown) => value is Array<unknown> = isType('array');
export const IsNumber: (value: unknown) => value is number = isType('number');
export const IsObject: (value: unknown) => value is object = isType('object');
export const IsString: (value: unknown) => value is string = isType('string');

export const IsElement: (value: unknown) => value is Element = isInstanceOf(Element);
export const IsNode: (value: unknown) => value is Node = isInstanceOf(Node);

export const IsInstance = <T>(value: unknown, instance: IClassConstructor<T>): value is T =>
	IsObject(value) && value instanceof instance;
