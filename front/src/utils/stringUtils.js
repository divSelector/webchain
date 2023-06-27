export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export function stripLeadingSlash(s) {
    return s.replace(/^\//, '');
}