import faker from 'faker';

export const num = () => faker.datatype.number();
export const str = () => faker.random.words();
export const bool = () => faker.datatype.boolean();
export const size = (maxSize: number) => Math.floor(maxSize * Math.random());
export const rndSize = (min: number, max: number): number => min + Math.round(max * Math.random());
export const rndAr = (size: number, itemCallback: (p: number) => unknown) => {
    const result: unknown[] = [];
    for (let i = 0; i < size; i++) {
        result.push(itemCallback(i));
    }
    return result;
};
