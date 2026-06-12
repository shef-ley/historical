const PEOPLE = [
  // Ancient World
  { name: "Socrates",        born: -470, died: -399, region: "Ancient Greece", color: "#7F77DD", wiki: "Socrates" },
  { name: "Plato",           born: -428, died: -348, region: "Ancient Greece", color: "#534AB7", wiki: "Plato" },
  { name: "Aristotle",       born: -384, died: -322, region: "Ancient Greece", color: "#3C3489", wiki: "Aristotle" },
  { name: "Alexander the Great", born: -356, died: -323, region: "Ancient Greece", color: "#26215C", wiki: "Alexander_the_Great" },
  { name: "Julius Caesar",   born: -100, died:  -44, region: "Ancient Rome",   color: "#D85A30", wiki: "Julius_Caesar" },
  { name: "Cleopatra VII",   born:  -69, died:  -30, region: "Ancient Rome",   color: "#993C1D", wiki: "Cleopatra" },
  { name: "Augustus",        born:  -63, died:   14, region: "Ancient Rome",   color: "#712B13", wiki: "Augustus" },

  // Renaissance & Early Modern
  { name: "Leonardo da Vinci",  born: 1452, died: 1519, region: "Renaissance",    color: "#1D9E75", wiki: "Leonardo_da_Vinci" },
  { name: "Michelangelo",       born: 1475, died: 1564, region: "Renaissance",    color: "#0F6E56", wiki: "Michelangelo" },
  { name: "Nicolaus Copernicus",born: 1473, died: 1543, region: "Renaissance",    color: "#085041", wiki: "Nicolaus_Copernicus" },
  { name: "Martin Luther",      born: 1483, died: 1546, region: "Renaissance",    color: "#04342C", wiki: "Martin_Luther" },

  // Enlightenment
  { name: "Isaac Newton",       born: 1643, died: 1727, region: "Enlightenment",  color: "#378ADD", wiki: "Isaac_Newton" },
  { name: "John Locke",         born: 1632, died: 1704, region: "Enlightenment",  color: "#185FA5", wiki: "John_Locke" },
  { name: "Voltaire",           born: 1694, died: 1778, region: "Enlightenment",  color: "#0C447C", wiki: "Voltaire" },
  { name: "Benjamin Franklin",  born: 1706, died: 1790, region: "Enlightenment",  color: "#042C53", wiki: "Benjamin_Franklin" },

  // American Founding Era
  { name: "George Washington",  born: 1732, died: 1799, region: "American Founding", color: "#639922", wiki: "George_Washington" },
  { name: "Thomas Jefferson",   born: 1743, died: 1826, region: "American Founding", color: "#3B6D11", wiki: "Thomas_Jefferson" },
  { name: "Napoleon Bonaparte", born: 1769, died: 1821, region: "American Founding", color: "#27500A", wiki: "Napoleon" },

  // 19th Century
  { name: "Abraham Lincoln",    born: 1809, died: 1865, region: "19th Century",   color: "#BA7517", wiki: "Abraham_Lincoln" },
  { name: "Charles Darwin",     born: 1809, died: 1882, region: "19th Century",   color: "#854F0B", wiki: "Charles_Darwin" },
  { name: "Karl Marx",          born: 1818, died: 1883, region: "19th Century",   color: "#633806", wiki: "Karl_Marx" },
  { name: "Frederick Douglass", born: 1818, died: 1895, region: "19th Century",   color: "#412402", wiki: "Frederick_Douglass" },

  // Early 20th Century
  { name: "Sigmund Freud",      born: 1856, died: 1939, region: "Early 20th Century", color: "#D4537E", wiki: "Sigmund_Freud" },
  { name: "Nikola Tesla",       born: 1856, died: 1943, region: "Early 20th Century", color: "#993556", wiki: "Nikola_Tesla" },
  { name: "Marie Curie",        born: 1867, died: 1934, region: "Early 20th Century", color: "#72243E", wiki: "Marie_Curie" },
  { name: "Albert Einstein",    born: 1879, died: 1955, region: "Early 20th Century", color: "#4B1528", wiki: "Albert_Einstein" },
  { name: "Winston Churchill",  born: 1874, died: 1965, region: "Early 20th Century", color: "#E24B4A", wiki: "Winston_Churchill" },
  { name: "Mahatma Gandhi",     born: 1869, died: 1948, region: "Early 20th Century", color: "#A32D2D", wiki: "Mahatma_Gandhi" },
];

const REGION_ORDER = [
  "Ancient Greece",
  "Ancient Rome",
  "Renaissance",
  "Enlightenment",
  "American Founding",
  "19th Century",
  "Early 20th Century",
];
