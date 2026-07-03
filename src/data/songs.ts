// EXPORTS: ISong, MOCK_SONGS, encPath
export interface ISong {
  id: string
  name: string
  difficulty: string
  jacket: string
}

/** Encode path for CSS url() — handles # ' and Unicode */
export function encPath(p: string): string {
  return p.split('/').map(s => encodeURIComponent(s).replace(/'/g,'%27').replace(/#/g,'%23')).join('/');
}

const J = 'arcaea_illustrations';

export const MOCK_SONGS: ISong[] = [
  { id: '1', name: 'PRAGMATISM -RESURRECTION-', difficulty: 'Beyond 11.2', jacket: `${J}/PRAGMATISM -RESURRECTION-.png` },
  { id: '2', name: 'Axium Crisis', difficulty: 'Future 10.6', jacket: `${J}/Axium Crisis.png` },
  { id: '3', name: 'Grievous Lady', difficulty: 'Future 11.1', jacket: `${J}/Grievous Lady.png` },
  { id: '4', name: 'Halcyon', difficulty: 'Future 10.5', jacket: `${J}/Halcyon.png` },
  { id: '5', name: 'Fracture Ray', difficulty: 'Future 11.1', jacket: `${J}/Fracture Ray.png` },
  { id: '6', name: 'Heavensdoor', difficulty: 'Beyond 10.8', jacket: `${J}/Heavensdoor.png` },
  { id: '7', name: 'Ringed Genesis', difficulty: 'Future 10.8', jacket: `${J}/Ringed Genesis.png` },
  { id: '8', name: 'Dantalion', difficulty: 'Future 10.8', jacket: `${J}/Dantalion.png` },
  { id: '9', name: 'Tempestissimo', difficulty: 'Future 10.7', jacket: `${J}/Tempestissimo.png` },
  { id: '10', name: '#1f1e33', difficulty: 'Future 11.1', jacket: `${J}/1f1e33.png` },
  { id: '11', name: 'Infinite Strife', difficulty: 'Beyond 10.9', jacket: `${J}/Infinite Strife.png` },
  { id: '12', name: 'Arcana Eden', difficulty: 'Future 10.5', jacket: `${J}/Arcana Eden.png` },
  { id: '13', name: 'World Ender', difficulty: 'Beyond 11.1', jacket: `${J}/World Ender.png` },
  { id: '14', name: 'Testify', difficulty: 'Future 10.9', jacket: `${J}/Testify.png` },
  { id: '15', name: 'Ego Eimi', difficulty: 'Future 10.5', jacket: `${J}/Ego Eimi.png` },
  { id: '16', name: 'Abstruse Dilemma', difficulty: 'Future 11.3', jacket: `${J}/Abstruse Dilemma.png` },
  { id: '17', name: 'Arghena', difficulty: 'Future 11.3', jacket: `${J}/Arghena.png` },
  { id: '18', name: 'ALTER EGO', difficulty: 'Eternal 11.3', jacket: `${J}/ALTER EGO.png` },
  { id: '19', name: 'Lament Rain', difficulty: 'Future 10.6', jacket: `${J}/Lament Rain.png` },
  { id: '20', name: 'Designant.', difficulty: 'Future 10.9', jacket: `${J}/Designant_.png` },
  { id: '21', name: 'ANDORXOR', difficulty: 'Eternal 10.8', jacket: `${J}/ANDORXOR.png` },
  { id: '22', name: 'Undying Macula', difficulty: 'Eternal 11.0', jacket: `${J}/Undying Macula.png` },
  { id: '23', name: 'Cyaegha', difficulty: 'Future 10.7', jacket: `${J}/Cyaegha.png` },
  { id: '24', name: 'Seclusion', difficulty: 'Future 10.6', jacket: `${J}/Seclusion.png` },
  { id: '25', name: 'Aegleseeker', difficulty: 'Future 11.2', jacket: `${J}/Aegleseeker.png` },
  { id: '26', name: 'Extradimensional Cosmic Phenomenon', difficulty: 'Eternal 11.3', jacket: `${J}/Extradimensional Cosmic Phenomenon.png` },
  { id: '27', name: 'Lilly', difficulty: 'Eternal 10.8', jacket: `${J}/Lilly.png` },
  { id: '28', name: "Welcome, Queen of Fiction.", difficulty: 'Eternal 10.9', jacket: `${J}/Welcome_ Queen of Fiction_.png` },
  { id: '29', name: 'Stasis', difficulty: 'Future 10.8', jacket: `${J}/Stasis.png` },
  { id: '30', name: 'Last Celebration', difficulty: 'Future 10.4', jacket: `${J}/Last Celebration.png` },
  { id: '31', name: "DA'AT -The First Seeker of Souls-", difficulty: 'Future 10.9', jacket: `${J}/DA_AT -The First Seeker of Souls-.png` },
  { id: '32', name: "Misdeed -la bonté de Dieu et l'origine du mal-", difficulty: 'Future 10.9', jacket: `${J}/Misdeed -la bonté de Dieu et l'origine du mal-.png` },
  { id: '33', name: "Spider's Thread", difficulty: 'Future 10.8', jacket: `${J}/Spider_s Thread.png` },
  { id: '34', name: 'World Vanquisher', difficulty: 'Future 10.7', jacket: `${J}/World Vanquisher.png` },
  { id: '35', name: "Don't Fight The Music", difficulty: 'Eternal 10.7', jacket: `${J}/Don_t Fight The Music.png` },
  { id: '36', name: 'And Revive The Melody', difficulty: 'Future 10.9', jacket: `${J}/And Revive The Melody.png` },
  { id: '37', name: 'LAMIA', difficulty: 'Future 11.0', jacket: `${J}/LAMIA.png` },
  { id: '38', name: 'ViRTUS', difficulty: 'Eternal 10.9', jacket: `${J}/ViRTUS.png` },
  { id: '39', name: 'AMAZING MIGHTYYYY!!!!', difficulty: 'Future 10.7', jacket: `${J}/AMAZING MIGHTYYYY____.png` },
  { id: '40', name: 'TEmPTaTiON', difficulty: 'Future 10.9', jacket: `${J}/TEmPTaTiON.png` },
  { id: '41', name: 'Inverted World', difficulty: 'Eternal 10.7', jacket: `${J}/Inverted World.png` },
  { id: '42', name: 'Vulcānus', difficulty: 'Future 10.9', jacket: `${J}/Vulcānus.png` },
  { id: '43', name: 'Code: Obilivion', difficulty: 'Eternal 10.9', jacket: `${J}/Code_ Obilivion.png` },
  { id: '44', name: 'MARENYX', difficulty: 'Eternal 10.8', jacket: `${J}/MARENYX.png` },
  { id: '45', name: 'SAIKYO STRONGER', difficulty: 'Future 11.0', jacket: `${J}/SAIKYO STRONGER.png` },
  { id: '46', name: 'Einherjar Joker', difficulty: 'Beyond 10.9', jacket: `${J}/Einherjar Joker.png` },
  { id: '47', name: 'Heavenly caress', difficulty: 'Beyond 10.9', jacket: `${J}/Heavenly caress.png` },
]