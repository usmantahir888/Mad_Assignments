//Ex of string methods

let name = "Sheraz Ahmed";
console.log(name);
console.log(name.length);
console.log(name.toUpperCase());
console.log(name.toLowerCase());
console.log(name.charAt(0));
console.log(name.charAt(1));
console.log(name.charAt(3));
console.log(name.indexOf('S'));
console.log(name.lastIndexOf('d'));
console.log(name.includes('Sheraz'));
console.log(name.startsWith('Sheraz'));
console.log(name.endsWith('Ahmed'));
console.log(name.substring(4, 9));
console.log(name.slice(3));
console.log(name.split('d'));
console.log(name.replace('Sheraz', 'Mr.'));

//Ex of array methods
let arr = ['Sheraz', 'Ahmed', 'Khan', 'JS', 'Developer', 2025];
console.log(arr);
console.log(arr.length);
console.log(arr[0]);
console.log(arr[1]);
console.log(arr.indexOf('Khan'));
console.log(arr.lastIndexOf('Developer'));
console.log(arr.includes('JS'));
console.log(arr.join(''));
console.log(arr.slice(2, 5));
console.log(arr.splice(1, 2));
console.log(arr.push('Developer'));
console.log(arr.pop());
console.log(arr.shift());
console.log(arr.unshift('Sheraz'));
console.log(arr.reverse());

let arr2 = ['Comsatas', 'University'];
console.log(arr.concat(arr2));