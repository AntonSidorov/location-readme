// Teaching typescript how to tell if a value if falsy or not. Simple !! conversion
export const filterOutFalsy = <T>(v?: T | undefined | null): v is T => !!v;
