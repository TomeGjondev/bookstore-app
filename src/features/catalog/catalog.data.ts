import type { Book } from './catalog.types'

export const books: Book[] = [
  {
    id: 'book-map-small-things', slug: 'the-map-of-small-things', title: 'The Map of Small Things', author: 'Elena Moss',
    description: 'When cartographer Ansel Vale inherits a box of unfinished maps, each one leads not to a place but to a forgotten moment. His search for their maker carries him through tiny museums, half-empty railway stations, and the kitchens of strangers—until the last map points quietly home.',
    shortDescription: 'A tender novel about memory, belonging, and all the places too small to appear on a map.',
    price: 18, format: 'Paperback', genre: 'Fiction', pageCount: 336, publisher: 'Marigold Press', publicationYear: 2025, isbn: '978-1-739201-04-8', inStock: true, inventoryCount: 7, rating: 4.8, featured: true, staffPick: true,
    staffNote: 'A small, radiant wonder. I wanted to live inside every page.', coverPalette: 'amber', coverMark: '✦',
  },
  {
    id: 'book-river-remembers', slug: 'when-the-river-remembers', title: 'When the River Remembers', author: 'Jon Bellweather',
    description: 'Along a river that redraws its banks every spring, three generations of one family keep a ferry, a promise, and a secret. Jon Bellweather writes with the patient force of moving water in this luminous story of inheritance and return.',
    shortDescription: 'A sweeping family story shaped by the river that remembers what its people try to forget.',
    price: 21, format: 'Hardcover', genre: 'Fiction', pageCount: 412, publisher: 'North Star House', publicationYear: 2024, isbn: '978-1-739201-11-6', inStock: true, inventoryCount: 4, rating: 4.6, featured: true, coverPalette: 'river', coverMark: '≈',
  },
  {
    id: 'book-greenhouse-letters', slug: 'letters-from-the-greenhouse', title: 'Letters from the Greenhouse', author: 'Iris Wren',
    description: 'Part botanical journal, part collection of letters, this gentle book follows a year spent tending an abandoned glasshouse. Iris Wren notices the stubborn, ordinary miracles of soil, seed, weather, and patient attention.',
    shortDescription: 'Seasonal letters on plants, patience, and learning to grow alongside a garden.',
    price: 16.5, format: 'Paperback', genre: 'Nature writing', pageCount: 248, publisher: 'Fern & Field', publicationYear: 2025, isbn: '978-1-739201-22-2', inStock: true, inventoryCount: 12, rating: 4.9, featured: true, staffPick: true,
    staffNote: 'Keep this beside the bed and read one letter whenever the world feels too loud.', coverPalette: 'moss', coverMark: '❦',
  },
  {
    id: 'book-starlight', slug: 'a-study-in-starlight', title: 'A Study in Starlight', author: 'C. A. Nightingale',
    description: 'An astronomer at the edge of retirement receives a signal that should not exist. What begins as a scientific mystery becomes an intimate meditation on solitude, wonder, and what it means to be answered.',
    shortDescription: 'An elegant, intimate mystery about an impossible signal and the courage to listen.',
    price: 24, format: 'Hardcover', genre: 'Fiction', pageCount: 368, publisher: 'Orion & Finch', publicationYear: 2025, isbn: '978-1-739201-29-1', inStock: true, inventoryCount: 5, rating: 4.7, featured: true, newArrival: true, coverPalette: 'night', coverMark: '✧',
  },
  {
    id: 'book-far-country', slug: 'the-far-country-by-foot', title: 'The Far Country by Foot', author: 'Theo March',
    description: 'With one small rucksack and no fixed itinerary, Theo March walks old paths across a changing landscape. His account is less about arriving than about the weather, meals, conversations, and silences found along the way.',
    shortDescription: 'A slow journey through overlooked landscapes and the people who call them home.',
    price: 19.5, format: 'Paperback', genre: 'Travel & place', pageCount: 304, publisher: 'Milestone Editions', publicationYear: 2023, isbn: '978-1-739201-33-8', inStock: true, inventoryCount: 3, rating: 4.4, staffPick: true,
    staffNote: 'A lovely antidote to rushing. Read it with a map and nowhere to be.', coverPalette: 'terracotta', coverMark: '⌁',
  },
  {
    id: 'book-moth-hour', slug: 'the-moth-hour', title: 'The Moth Hour', author: 'Nell Avery',
    description: 'These spare, luminous poems watch the world at its quietest: moths at a window, a kitchen after midnight, a field holding the last of the day. Nell Avery finds whole constellations in small domestic moments.',
    shortDescription: 'Poems for the tender hour between one day and the next.',
    price: 14, format: 'Paperback', genre: 'Poetry', pageCount: 112, publisher: 'Little Bell Poetry', publicationYear: 2024, isbn: '978-1-739201-40-6', inStock: true, inventoryCount: 9, rating: 4.8, coverPalette: 'plum', coverMark: '☾',
  },
  {
    id: 'book-wild-orchard', slug: 'the-wild-orchard', title: 'The Wild Orchard', author: 'Maeve Rowan',
    description: 'An orchard left to itself becomes a living archive. Through essays that blend ecology, folklore, and memoir, Maeve Rowan explores what flourishes when human hands choose to guide less and notice more.',
    shortDescription: 'Essays on old fruit trees, unruly ecologies, and the wisdom of leaving room.',
    price: 22, format: 'Hardcover', genre: 'Nature writing', pageCount: 280, publisher: 'Fern & Field', publicationYear: 2025, isbn: '978-1-739201-47-5', inStock: true, inventoryCount: 6, rating: 4.7, newArrival: true, coverPalette: 'sage', coverMark: '♧',
  },
  {
    id: 'book-winter-postcards', slug: 'postcards-from-a-winter-sea', title: 'Postcards from a Winter Sea', author: 'Sofia Bell',
    description: 'On a remote island in the northern sea, a photographer records one winter in brief dispatches and silver-blue images. The result is a beautiful study of weather, isolation, and unexpected community.',
    shortDescription: 'A visual travelogue from the bright, wind-scoured edge of the world.',
    price: 28, format: 'Hardcover', genre: 'Travel & place', pageCount: 224, publisher: 'Wayfinder Books', publicationYear: 2025, isbn: '978-1-739201-51-2', inStock: false, inventoryCount: 0, rating: 4.5, newArrival: true, coverPalette: 'river', coverMark: '∿',
  },
  {
    id: 'book-paper-birds', slug: 'a-field-guide-to-paper-birds', title: 'A Field Guide to Paper Birds', author: 'Lina Hart',
    description: 'A young archivist discovers delicate paper birds hidden inside returned library books. Each carries a message, and together they seem to form directions to someone who vanished decades ago.',
    shortDescription: 'A bookish mystery filled with secret messages, paper wings, and second chances.',
    price: 17.5, format: 'Paperback', genre: 'Fiction', pageCount: 320, publisher: 'Marigold Press', publicationYear: 2024, isbn: '978-1-739201-57-4', inStock: true, inventoryCount: 8, rating: 4.6, coverPalette: 'ink', coverMark: '⌁',
  },
  {
    id: 'book-after-rain', slug: 'after-the-rain', title: 'After the Rain', author: 'Tomas Alder',
    description: 'Tomas Alder turns his attention to wet pavements, open windows, garden paths, and the bright silence after a storm. These poems are clear-eyed, generous, and alive to change.',
    shortDescription: 'Clear, restorative poems about weather passing and the world beginning again.',
    price: 13.5, format: 'Paperback', genre: 'Poetry', pageCount: 96, publisher: 'Little Bell Poetry', publicationYear: 2025, isbn: '978-1-739201-62-8', inStock: true, inventoryCount: 11, rating: 4.3, newArrival: true, coverPalette: 'sage', coverMark: '☂',
  },
  {
    id: 'book-cabinet-summer', slug: 'the-cabinet-of-summer', title: 'The Cabinet of Summer', author: 'Edith Vale',
    description: 'A naturalist gathers the fleeting details of one summer—feathers, seed heads, dragonfly wings, bird calls—into an illustrated cabinet of curiosities for readers of every age.',
    shortDescription: 'An illustrated celebration of all the small wonders one summer can hold.',
    price: 26, format: 'Hardcover', genre: 'Nature writing', pageCount: 192, publisher: 'Acorn & Thread', publicationYear: 2023, isbn: '978-1-739201-71-0', inStock: true, inventoryCount: 2, rating: 4.9, staffPick: true,
    staffNote: 'Open this anywhere and you will find something worth looking at twice.', coverPalette: 'amber', coverMark: '✺',
  },
  {
    id: 'book-northbound', slug: 'northbound-at-dawn', title: 'Northbound at Dawn', author: 'Milo Crane',
    description: 'A sleeper train, seven passengers, and one night of unexpected confessions. As the landscape slips northward, each traveler must decide what to leave behind before morning.',
    shortDescription: 'A quietly suspenseful railway novel about strangers briefly traveling together.',
    price: 20, format: 'Hardcover', genre: 'Fiction', pageCount: 352, publisher: 'North Star House', publicationYear: 2025, isbn: '978-1-739201-78-9', inStock: false, inventoryCount: 0, rating: 4.2, newArrival: true, coverPalette: 'plum', coverMark: '↟',
  },
]

export const genres = [...new Set(books.map((book) => book.genre))]
