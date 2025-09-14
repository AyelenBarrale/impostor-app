export interface Word {
  id: string;
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const wordCategories = {
  comida: {
    name: 'Comida',
    words: [
      { id: '1', word: 'pizza', category: 'comida', difficulty: 'easy' },
      { id: '2', word: 'hamburguesa', category: 'comida', difficulty: 'easy' },
      { id: '3', word: 'manzana', category: 'comida', difficulty: 'easy' },
      { id: '4', word: 'banana', category: 'comida', difficulty: 'easy' },
      { id: '5', word: 'helado', category: 'comida', difficulty: 'easy' },
      { id: '6', word: 'sandwich', category: 'comida', difficulty: 'easy' },
      { id: '7', word: 'huevo', category: 'comida', difficulty: 'easy' },
      { id: '8', word: 'queso', category: 'comida', difficulty: 'easy' },
      { id: '9', word: 'pan', category: 'comida', difficulty: 'easy' },
      { id: '10', word: 'leche', category: 'comida', difficulty: 'easy' },
      { id: '11', word: 'café', category: 'comida', difficulty: 'easy' },
      { id: '12', word: 'torta', category: 'comida', difficulty: 'easy' },
      { id: '13', word: 'carne', category: 'comida', difficulty: 'easy' },
      { id: '14', word: 'pescado', category: 'comida', difficulty: 'easy' },
      { id: '15', word: 'arroz', category: 'comida', difficulty: 'easy' }
    ]
  },
  animales: {
    name: 'Animales',
    words: [
      { id: '16', word: 'perro', category: 'animales', difficulty: 'easy' },
      { id: '17', word: 'gato', category: 'animales', difficulty: 'easy' },
      { id: '18', word: 'pájaro', category: 'animales', difficulty: 'easy' },
      { id: '19', word: 'pez', category: 'animales', difficulty: 'easy' },
      { id: '20', word: 'conejo', category: 'animales', difficulty: 'easy' },
      { id: '21', word: 'vaca', category: 'animales', difficulty: 'easy' },
      { id: '22', word: 'cerdo', category: 'animales', difficulty: 'easy' },
      { id: '23', word: 'gallina', category: 'animales', difficulty: 'easy' },
      { id: '24', word: 'caballo', category: 'animales', difficulty: 'easy' },
      { id: '25', word: 'oveja', category: 'animales', difficulty: 'easy' },
      { id: '26', word: 'pato', category: 'animales', difficulty: 'easy' },
      { id: '27', word: 'rana', category: 'animales', difficulty: 'easy' },
      { id: '28', word: 'ratón', category: 'animales', difficulty: 'easy' },
      { id: '29', word: 'abeja', category: 'animales', difficulty: 'easy' },
      { id: '30', word: 'mariposa', category: 'animales', difficulty: 'easy' }
    ]
  },
  objetos: {
    name: 'Objetos',
    words: [
      { id: '31', word: 'casa', category: 'objetos', difficulty: 'easy' },
      { id: '32', word: 'auto', category: 'objetos', difficulty: 'easy' },
      { id: '33', word: 'bicicleta', category: 'objetos', difficulty: 'easy' },
      { id: '34', word: 'avión', category: 'objetos', difficulty: 'easy' },
      { id: '35', word: 'barco', category: 'objetos', difficulty: 'easy' },
      { id: '36', word: 'tren', category: 'objetos', difficulty: 'easy' },
      { id: '37', word: 'mesa', category: 'objetos', difficulty: 'easy' },
      { id: '38', word: 'silla', category: 'objetos', difficulty: 'easy' },
      { id: '39', word: 'cama', category: 'objetos', difficulty: 'easy' },
      { id: '40', word: 'puerta', category: 'objetos', difficulty: 'easy' },
      { id: '41', word: 'ventana', category: 'objetos', difficulty: 'easy' },
      { id: '42', word: 'lámpara', category: 'objetos', difficulty: 'easy' },
      { id: '43', word: 'reloj', category: 'objetos', difficulty: 'easy' },
      { id: '44', word: 'libro', category: 'objetos', difficulty: 'easy' },
      { id: '45', word: 'flor', category: 'objetos', difficulty: 'easy' }
    ]
  },
  deportes: {
    name: 'Deportes',
    words: [
      { id: '46', word: 'fútbol', category: 'deportes', difficulty: 'easy' },
      { id: '47', word: 'tenis', category: 'deportes', difficulty: 'easy' },
      { id: '48', word: 'natación', category: 'deportes', difficulty: 'easy' },
      { id: '49', word: 'ciclismo', category: 'deportes', difficulty: 'easy' },
      { id: '50', word: 'boxeo', category: 'deportes', difficulty: 'easy' },
      { id: '51', word: 'golf', category: 'deportes', difficulty: 'easy' },
      { id: '52', word: 'básquet', category: 'deportes', difficulty: 'easy' },
      { id: '53', word: 'vóley', category: 'deportes', difficulty: 'easy' },
      { id: '54', word: 'hockey', category: 'deportes', difficulty: 'easy' },
      { id: '55', word: 'béisbol', category: 'deportes', difficulty: 'easy' },
      { id: '56', word: 'patinaje', category: 'deportes', difficulty: 'easy' },
      { id: '57', word: 'esquí', category: 'deportes', difficulty: 'easy' },
      { id: '58', word: 'surf', category: 'deportes', difficulty: 'easy' },
      { id: '59', word: 'rugby', category: 'deportes', difficulty: 'easy' },
      { id: '60', word: 'atletismo', category: 'deportes', difficulty: 'easy' }
    ]
  },
  cuerpo: {
    name: 'Partes del Cuerpo',
    words: [
      { id: '61', word: 'cabeza', category: 'cuerpo', difficulty: 'easy' },
      { id: '62', word: 'ojo', category: 'cuerpo', difficulty: 'easy' },
      { id: '63', word: 'nariz', category: 'cuerpo', difficulty: 'easy' },
      { id: '64', word: 'boca', category: 'cuerpo', difficulty: 'easy' },
      { id: '65', word: 'oreja', category: 'cuerpo', difficulty: 'easy' },
      { id: '66', word: 'mano', category: 'cuerpo', difficulty: 'easy' },
      { id: '67', word: 'pie', category: 'cuerpo', difficulty: 'easy' },
      { id: '68', word: 'brazo', category: 'cuerpo', difficulty: 'easy' },
      { id: '69', word: 'pierna', category: 'cuerpo', difficulty: 'easy' },
      { id: '70', word: 'dedo', category: 'cuerpo', difficulty: 'easy' },
      { id: '71', word: 'diente', category: 'cuerpo', difficulty: 'easy' },
      { id: '72', word: 'cabello', category: 'cuerpo', difficulty: 'easy' },
      { id: '73', word: 'ceja', category: 'cuerpo', difficulty: 'easy' },
      { id: '74', word: 'lengua', category: 'cuerpo', difficulty: 'easy' },
      { id: '75', word: 'cuello', category: 'cuerpo', difficulty: 'easy' }
    ]
  },
  naturaleza: {
    name: 'Naturaleza',
    words: [
      { id: '76', word: 'sol', category: 'naturaleza', difficulty: 'easy' },
      { id: '77', word: 'luna', category: 'naturaleza', difficulty: 'easy' },
      { id: '78', word: 'estrella', category: 'naturaleza', difficulty: 'easy' },
      { id: '79', word: 'nube', category: 'naturaleza', difficulty: 'easy' },
      { id: '80', word: 'lluvia', category: 'naturaleza', difficulty: 'easy' },
      { id: '81', word: 'árbol', category: 'naturaleza', difficulty: 'easy' },
      { id: '82', word: 'flor', category: 'naturaleza', difficulty: 'easy' },
      { id: '83', word: 'hoja', category: 'naturaleza', difficulty: 'easy' },
      { id: '84', word: 'montaña', category: 'naturaleza', difficulty: 'easy' },
      { id: '85', word: 'río', category: 'naturaleza', difficulty: 'easy' },
      { id: '86', word: 'mar', category: 'naturaleza', difficulty: 'easy' },
      { id: '87', word: 'arena', category: 'naturaleza', difficulty: 'easy' },
      { id: '88', word: 'piedra', category: 'naturaleza', difficulty: 'easy' },
      { id: '89', word: 'fuego', category: 'naturaleza', difficulty: 'easy' },
      { id: '90', word: 'nieve', category: 'naturaleza', difficulty: 'easy' }
    ]
  },
  formas: {
    name: 'Formas y Colores',
    words: [
      { id: '91', word: 'círculo', category: 'formas', difficulty: 'easy' },
      { id: '92', word: 'cuadrado', category: 'formas', difficulty: 'easy' },
      { id: '93', word: 'triángulo', category: 'formas', difficulty: 'easy' },
      { id: '94', word: 'rectángulo', category: 'formas', difficulty: 'easy' },
      { id: '95', word: 'estrella', category: 'formas', difficulty: 'easy' },
      { id: '96', word: 'corazón', category: 'formas', difficulty: 'easy' },
      { id: '97', word: 'rojo', category: 'formas', difficulty: 'easy' },
      { id: '98', word: 'azul', category: 'formas', difficulty: 'easy' },
      { id: '99', word: 'verde', category: 'formas', difficulty: 'easy' },
      { id: '100', word: 'amarillo', category: 'formas', difficulty: 'easy' },
      { id: '101', word: 'negro', category: 'formas', difficulty: 'easy' },
      { id: '102', word: 'blanco', category: 'formas', difficulty: 'easy' },
      { id: '103', word: 'rosa', category: 'formas', difficulty: 'easy' },
      { id: '104', word: 'marrón', category: 'formas', difficulty: 'easy' },
      { id: '105', word: 'naranja', category: 'formas', difficulty: 'easy' }
    ]
  }
};

export const getAllWords = (): Word[] => {
  const allWords: Word[] = [];
  Object.keys(wordCategories).forEach(key => {
    const category = wordCategories[key as keyof typeof wordCategories];
    category.words.forEach(word => allWords.push(word as Word));
  });
  return allWords;
};

export const getWordsByCategory = (category: string): Word[] => {
  return (wordCategories[category as keyof typeof wordCategories]?.words as Word[]) || [];
};

export const getRandomWord = (category?: string): Word => {
  const words = category ? getWordsByCategory(category) : getAllWords();
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};
