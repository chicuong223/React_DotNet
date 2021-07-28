let data = 42;

data = 10;

interface ICar{
    color: string;
    model: string;
    topSpeed?: number; //this field is optional
}

const car1: ICar = {
    color: 'blue',
    model: 'BMW'
}

const car2: ICar = {
    color: 'red',
    model: 'Mercedes',
    topSpeed: 100
}

//must assign a type for variables inside expression
const multiply = (x: number, y: number): string => {
    return (x*y).toString();
}
