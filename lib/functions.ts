export function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export const paginate = (selectedPage: number, elementsPerPage: number, arrayToPaginate: any[]) => {
    const indexMin = selectedPage * elementsPerPage;
    const indexMax = indexMin + elementsPerPage;
    const paginatedArray = arrayToPaginate.filter(
        (x, index) => index >= indexMin && index < indexMax
    );
    return paginatedArray
}