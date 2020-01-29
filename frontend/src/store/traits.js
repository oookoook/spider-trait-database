var traits = [
    {id:2, abbrev:'inst', category: {id: 0, name: 'Life History'}, name: 'Number of instars', description: 'Number of instars, beginning with the first free instar and ending with the adult stage (e.g. 7)', dataType: {id:0, name: 'integer'}, standard: 'no unit', reference: null},
{id:3, abbrev:'incp', category: {id: 0, name: 'Life History'}, name: 'Incubation period', description: 'Number of days at certain temperature beginning with egg laying and ending with the moult to the first free instar', dataType: {id:0, name: 'integer'}, standard: 'days', reference: {id: 1, abbrev: 'Kucera, 2020'}},
{id:4, abbrev:'indu', category: {id: 0, name: 'Life History'}, name: 'Instar duration', description: 'Number of days spent in a certain juvenile instar stage at certan temperature', dataType: {id:0, name: 'integer'}, standard: 'days', reference: null},
{id:5, abbrev:'sexr', category: {id: 0, name: 'Life History'}, name: 'Sex ratio', description: 'Number of males divided by the number of females, ie. Nm/Nf. It should be estimated only by a method that does not bias any sex number.', dataType: {id:0, name: 'real number (0-1)'}, standard: 'ratio ', reference: null},
{id:6, abbrev:'lonv', category: {id: 0, name: 'Life History'}, name: 'Longevity', description: 'Number of days from the first free instar to the end of life /method', dataType: {id:0, name: 'integer'}, standard: 'days', reference: null},
{id:7, abbrev:'coty', category: {id: 0, name: 'Reproduction'}, name: 'Courtship type', description: 'Sensual modality used during courtship', dataType: {id:0, name: 'character'}, standard: '', reference: null},
{id:8, abbrev:'codu', category: {id: 0, name: 'Reproduction'}, name: 'Duration of courtship', description: 'Time from starting the courtship to the beginning of copulation', dataType: {id:0, name: 'real number'}, standard: 'minutes', reference: null},
{id:9, abbrev:'coco', category: {id: 0, name: 'Reproduction'}, name: 'Coersive copulation', description: 'Presence of coersive mating indicated by causing injuries to the other sex', dataType: {id:0, name: 'binary'}, standard: '', reference: null},
{id:10, abbrev:'sexc', category: {id: 0, name: 'Reproduction'}, name: 'Sexual cannibalism', description: 'if sexual cannibalism occurs', dataType: {id:0, name: 'binary'}, standard: '', reference: null},
{id:11, abbrev:'mapo', category: {id: 0, name: 'Reproduction'}, name: 'Mating position', description: 'Type of a mating position', dataType: {id:0, name: 'character'}, standard: '', reference: null},
{id:12, abbrev:'nupa', category: {id: 0, name: 'Reproduction'}, name: 'No. of partners', description: 'Total number of mated partners', dataType: {id:0, name: 'integer'}, standard: 'no unit', reference: null},
{id:13, abbrev:'eplu', category: {id: 0, name: 'Reproduction'}, name: 'Epigyne plugging', description: 'Mode of blocking access to the female epigyne', dataType: {id:0, name: 'character'}, standard: 'valid categories: excretion; embolus; none; other', reference: null},
{id:14, abbrev:'eglo', category: {id: 0, name: 'Reproduction'}, name: 'Eggsac location', description: 'Microhabitat place where eggsac is deposited', dataType: {id:0, name: 'character'}, standard: 'valid categories: under stone; on trunk; in web; on grass; on foliage', reference: null},
{id:15, abbrev:'egsn', category: {id: 0, name: 'Reproduction'}, name: 'Number of eggsacs', description: 'Total number of eggsacs produced by a female during her life ', dataType: {id:0, name: 'integer'}, standard: 'no unit', reference: null},
{id:16, abbrev:'eggn', category: {id: 0, name: 'Reproduction'}, name: 'Number of eggs/sac', description: 'Number of eggs in a clutch (eggsac) / eggsac order', dataType: {id:0, name: 'integer'}, standard: 'no unit', reference: null},
{id:17, abbrev:'maca', category: {id: 0, name: 'Reproduction'}, name: 'Maternal care', description: 'Extent of maternal care', dataType: {id:0, name: 'character'}, standard: 'valid categories: none; guarding egg sac; guarding egg sac and spiderlings', reference: null},
{id:18, abbrev:'maph', category: {id: 0, name: 'Reproduction'}, name: 'Matriphagy', description: 'Presence of matriphagy (offspring feeding on tissue of mother)', dataType: {id:0, name: 'binary'}, standard: '', reference: null},
{id:19, abbrev:'preo', category: {id: 0, name: 'Predation'}, name: 'Prey Order', description: 'Order of organism the spider preys on', dataType: {id:0, name: 'character'}, standard: 'must be given as organism Order', reference: null},
{id:20, abbrev:'prey', category: {id: 0, name: 'Predation'}, name: 'Prey', description: 'Type of organims the spider preys on (verbal description)', dataType: {id:0, name: 'character'}, standard: '', reference: null},
{id:21, abbrev:'guil', category: {id: 0, name: 'Predation'}, name: 'Hunting guild', description: 'Ecological hunting guild', dataType: {id:0, name: 'character'}, standard: 'categorization must be defined as method!', reference: null},
{id:22, abbrev:'webb', category: {id: 0, name: 'Predation'}, name: 'Web building', description: 'if the spider builds a web to capture prey (includes sensing webs but not retreats that are not used to improve prey recognition or immibilization)', dataType: {id:0, name: 'binary'}, standard: '', reference: null},
{id:23, abbrev:'webt', category: {id: 0, name: 'Predation'}, name: 'Web type', description: 'type of web built', dataType: {id:0, name: 'character'}, standard: 'valid categories: orb web; cob web with gumfoot lines; sheet web; canopy web; space web; open tube; tube with trap door; tube with signaling lines; single line; other', reference: null},
{id:24, abbrev:'webd', category: {id: 0, name: 'Predation'}, name: 'Web diameter', description: 'maximal linear dimension of web', dataType: {id:0, name: 'real number'}, standard: 'in cm', reference: null},
{id:25, abbrev:'weba', category: {id: 0, name: 'Predation'}, name: 'Web area', description: 'maximal size of web projected in a 2-dimensional space', dataType: {id:0, name: 'real number'}, standard: 'in cm2', reference: null},
{id:26, abbrev:'webv', category: {id: 0, name: 'Predation'}, name: 'Web volume', description: '3-dimensional size of web', dataType: {id:0, name: 'real number'}, standard: 'in cm3', reference: null},
{id:27, abbrev:'prec', category: {id: 0, name: 'Predation'}, name: 'Prey capture', description: 'Mode of prey capture', dataType: {id:0, name: 'character'}, standard: 'valid categories: bite-and-release; grab-and-hold; wrapping; throwing silk; other', reference: null},
{id:28, abbrev:'prde', category: {id: 0, name: 'Defense'}, name: 'Primary strategy', description: 'A strategy used prior to being detected by a predator', dataType: {id:0, name: 'character'}, standard: 'valid categories: Cryptic (background matching); Cryptic (disruptive coloration); Cryptic (countershading); Aposematic; Batesian mimic; Camouflage; Mullerian mimic', reference: null},
{id:29, abbrev:'modl', category: {id: 0, name: 'Defense'}, name: 'Model', description: 'In case of camouflage and mimicry the model it imitates', dataType: {id:0, name: 'character'}, standard: '', reference: null},
{id:30, abbrev:'sede', category: {id: 0, name: 'Defense'}, name: 'Secondary strategy', description: 'A strategy used after being detected by a predator', dataType: {id:0, name: 'character'}, standard: 'valid categories: death feigning; rapid escape; threatening posture; dazzle camouflage; startle; chemical deterrents; colour change; sound production', reference: null},
{id:31, abbrev:'retr', category: {id: 0, name: 'Defense'}, name: 'Retreat', description: 'Type of a retreat used to avoid predation', dataType: {id:0, name: 'character'}, standard: 'valid categories: on web; in grass; under bark; silk sac; burrow; other', reference: null},
{id:32, abbrev:'pred', category: {id: 0, name: 'Defense'}, name: 'Predator', description: 'Type of predator ', dataType: {id:0, name: 'character'}, standard: '', reference: null},
{id:33, abbrev:'habi', category: {id: 0, name: 'Ecology'}, name: 'IUCN Habitat', description: 'habitat following global classification', dataType: {id:0, name: 'character'}, standard: 'valid categories: Forest; Savanna; Shrubland; Grassland; Wetlands; Rocky areas; Caves and Subterranean Habitats; Desert; Freshwater; Coastal; Urban, Agricultural; Other', reference: null},
{id:34, abbrev:'habl', category: {id: 0, name: 'Ecology'}, name: 'Habitat local', description: 'local habitat classification', dataType: {id:0, name: 'character'}, standard: '', reference: null},
{id:35, abbrev:'stra', category: {id: 0, name: 'Ecology'}, name: 'Stratum', description: 'Horizontal stratum occupied', dataType: {id:0, name: 'character'}, standard: 'valid categories: underground; ground; herb layer; shrub layer; tree trunks; canopy; wall', reference: null},
{id:36, abbrev:'phen', category: {id: 0, name: 'Ecology'}, name: 'Phenology', description: 'Months at which adult stage occur', dataType: {id:0, name: 'character'}, standard: 'valid categories: January; February; March; April; May; June; July; August; September; October; November; December', reference: null},
{id:37, abbrev:'ovws', category: {id: 0, name: 'Ecology'}, name: 'Overwintering stage', description: 'Ontogenetic stage at which overwintering occurs', dataType: {id:0, name: 'character'}, standard: 'valid categories: juvenile; subadult; adult', reference: null},
{id:38, abbrev:'circ', category: {id: 0, name: 'Ecology'}, name: 'Circadian activity', description: 'Hours of a day when the species is active (foraging, mating, web-building)', dataType: {id:0, name: 'character'}, standard: 'valid categories: diurnal; nocturnal; 1; 2; 3; 4; 5; 6; 7; 8; 9; 10; 11; 12; 13; 14; 15; 16; 17; 18; 19; 20; 21; 22; 23; 24', reference: null},
{id:39, abbrev:'rasi', category: {id: 0, name: 'Ecology'}, name: 'Range size', description: 'Area of the species distribution range', dataType: {id:0, name: 'real number'}, standard: 'in km2', reference: null},
{id:40, abbrev:'balo', category: {id: 0, name: 'Ecology'}, name: 'Balooning', description: 'Dispersal by ballooning', dataType: {id:0, name: 'binary'}, standard: '', reference: null},
{id:41, abbrev:'disp', category: {id: 0, name: 'Ecology'}, name: 'Dispersal time', description: 'Months at which dispersal occurs', dataType: {id:0, name: 'character'}, standard: 'valid categories: January; February; March; April; May; June; July; August; September; October; November; December', reference: null},
{id:42, abbrev:'soci', category: {id: 0, name: 'Ecology'}, name: 'Social Degree', description: 'Degree of sociality', dataType: {id:0, name: 'character'}, standard: 'valid categories: solitary, subsocial, colonial, quasisocial, social ', reference: null},
{id:43, abbrev:'rspd', category: {id: 0, name: 'Biomechanical'}, name: 'Running speed', description: 'Maximal running speed (travelling horizontally)', dataType: {id:0, name: 'real number'}, standard: 'in cm/s', reference: null},
{id:44, abbrev:'cspd', category: {id: 0, name: 'Biomechanical'}, name: 'Climbing speed', description: 'Maximal climbing speed (travelling on a slope)', dataType: {id:0, name: 'real number'}, standard: 'in cm/s', reference: null},
{id:45, abbrev:'stre', category: {id: 0, name: 'Biomechanical'}, name: 'Silk strength', description: 'Maximal engineering strength of silk', dataType: {id:0, name: 'real number'}, standard: 'in MPa', reference: null},
{id:46, abbrev:'stra', category: {id: 0, name: 'Biomechanical'}, name: 'Silk strain', description: 'Maximal engineering strain of silk', dataType: {id:0, name: 'real number'}, standard: 'in mm/mm', reference: null},
{id:47, abbrev:'toug', category: {id: 0, name: 'Biomechanical'}, name: 'Silk toughness', description: 'Toughness of silk', dataType: {id:0, name: 'real number'}, standard: 'in MPa', reference: null},
{id:48, abbrev:'adhe', category: {id: 0, name: 'Biomechanical'}, name: 'Web adhesion', description: 'Adhesion of capture thread', dataType: {id:0, name: 'real number'}, standard: 'in MPa', reference: null},
{id:49, abbrev:'pytu', category: {id: 0, name: 'Physiological'}, name: 'Upper thermal limit', description: 'maximal temperature limit the spider can tolerate', dataType: {id:0, name: 'real number'}, standard: 'in °C', reference: null},
{id:50, abbrev:'pytl', category: {id: 0, name: 'Physiological'}, name: 'Lower thermal limit', description: 'minimal temperature limit the spider can tolerate', dataType: {id:0, name: 'real number'}, standard: 'in °C', reference: null},
{id:51, abbrev:'pydr', category: {id: 0, name: 'Physiological'}, name: 'Drought tolerance', description: 'minimal relative humidity the spider can tolerate', dataType: {id:0, name: 'percentage'}, standard: 'in % RH', reference: null},
{id:52, abbrev:'pymr', category: {id: 0, name: 'Physiological'}, name: 'Resting metabolic rate', description: 'Oxygen consumption per time when inactive', dataType: {id:0, name: 'real number'}, standard: 'in W', reference: null},
{id:53, abbrev:'pysb', category: {id: 0, name: 'Physiological'}, name: 'Submerging time', description: 'Survival time underwater', dataType: {id:0, name: 'integer'}, standard: 'in h', reference: null},
{id:54, abbrev:'bole', category: {id: 0, name: 'Morphometric'}, name: 'body length', description: 'total body length from carapace frontal (excl. chelicerae) to opisthosoma posterior (excl. spinnerets)', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:55, abbrev:'cele', category: {id: 0, name: 'Morphometric'}, name: 'Cephalothorax length', description: 'length of prosoma along mid line', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:56, abbrev:'cewe', category: {id: 0, name: 'Morphometric'}, name: 'Cephalothorax width', description: 'width of prosoma at widest point', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:57, abbrev:'cehe', category: {id: 0, name: 'Morphometric'}, name: 'Cephalothorax height', description: 'carapace height at highest point', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:58, abbrev:'able', category: {id: 0, name: 'Morphometric'}, name: 'Abdomen length', description: 'opisthosoma length from anterior to posterior at mid line (excl. petiolus and spinnerets)', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:59, abbrev:'abwi', category: {id: 0, name: 'Morphometric'}, name: 'Abdomen width', description: 'opisthosoma width at widest point', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:60, abbrev:'abhe', category: {id: 0, name: 'Morphometric'}, name: 'Abdomen height', description: 'opisthosoma height at highest point (measured vertical to body axis)', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:61, abbrev:'chle', category: {id: 0, name: 'Morphometric'}, name: 'Chelicerae basal part (paturon) length', description: 'length of cheliceral base segment (paturon) along external margin', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:62, abbrev:'fale', category: {id: 0, name: 'Morphometric'}, name: 'Fang length', description: 'Cheliceral fang length from mid basal to tip', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:63, abbrev:'L1le', category: {id: 0, name: 'Morphometric'}, name: 'Leg I length', description: 'total length of leg I (front leg) excluding coxa and trochanter', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:64, abbrev:'Tar1', category: {id: 0, name: 'Morphometric'}, name: 'Tarsus I length', description: 'tarsus length of leg I', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:65, abbrev:'Met1', category: {id: 0, name: 'Morphometric'}, name: 'Metatarsus I length', description: 'metatarsus length of leg I', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:66, abbrev:'Tib1', category: {id: 0, name: 'Morphometric'}, name: 'Tibia I length', description: 'tibia length of leg I', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:67, abbrev:'Pat1', category: {id: 0, name: 'Morphometric'}, name: 'Patella I length', description: 'patella length of leg I', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:68, abbrev:'Fem1', category: {id: 0, name: 'Morphometric'}, name: 'Femur I length', description: 'femur length of leg I', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:69, abbrev:'Tro1', category: {id: 0, name: 'Morphometric'}, name: 'Trochanter I length', description: 'trochanter length of leg I', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:70, abbrev:'Cox1', category: {id: 0, name: 'Morphometric'}, name: 'Coxa I length', description: 'coxa length of leg I', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:71, abbrev:'L2le', category: {id: 0, name: 'Morphometric'}, name: 'Leg II length', description: 'total length of leg II (second anterior) excluding coxa and trochanter', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:72, abbrev:'Tar2', category: {id: 0, name: 'Morphometric'}, name: 'Tarsus II length', description: 'tarsus length of leg II', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:73, abbrev:'Met2', category: {id: 0, name: 'Morphometric'}, name: 'Metatarsus II length', description: 'metatarsus length of leg II', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:74, abbrev:'Tib2', category: {id: 0, name: 'Morphometric'}, name: 'Tibia II length', description: 'tibia length of leg II', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:75, abbrev:'Pat2', category: {id: 0, name: 'Morphometric'}, name: 'Patella II length', description: 'patella length of leg II', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:76, abbrev:'Fem2', category: {id: 0, name: 'Morphometric'}, name: 'Femur II length', description: 'femur length of leg II', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:77, abbrev:'Tro2', category: {id: 0, name: 'Morphometric'}, name: 'Trochanter II length', description: 'trochanter length of leg II', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:78, abbrev:'Cox2', category: {id: 0, name: 'Morphometric'}, name: 'Coxa II length', description: 'coxa length of leg II', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:79, abbrev:'L3le', category: {id: 0, name: 'Morphometric'}, name: 'Leg III length', description: 'total length of leg III (second posterior) excluding coxa and trochanter', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:80, abbrev:'Tar3', category: {id: 0, name: 'Morphometric'}, name: 'Tarsus III length', description: 'tarsus length of leg III', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:81, abbrev:'Met3', category: {id: 0, name: 'Morphometric'}, name: 'Metatarsus III length', description: 'metatarsus length of leg III', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:82, abbrev:'Tib3', category: {id: 0, name: 'Morphometric'}, name: 'Tibia III length', description: 'tibia length of leg III', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:83, abbrev:'Pat3', category: {id: 0, name: 'Morphometric'}, name: 'Patella III length', description: 'patella length of leg III', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:84, abbrev:'Fem3', category: {id: 0, name: 'Morphometric'}, name: 'Femur III length', description: 'femur length of leg III', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:85, abbrev:'Tro3', category: {id: 0, name: 'Morphometric'}, name: 'Trochanter III length', description: 'trochanter length of leg III', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:86, abbrev:'Cox3', category: {id: 0, name: 'Morphometric'}, name: 'Coxa III length', description: 'coxa length of leg III', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:87, abbrev:'L4le', category: {id: 0, name: 'Morphometric'}, name: 'Leg IV length', description: 'total length of leg IV (hind leg) excluding coxa and trochanter', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:88, abbrev:'Tar4', category: {id: 0, name: 'Morphometric'}, name: 'Tarsus IV length', description: 'tarsus length of leg IV', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:89, abbrev:'Met4', category: {id: 0, name: 'Morphometric'}, name: 'Metatarsus IV length', description: 'metatarsus length of leg IV', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:90, abbrev:'Tib4', category: {id: 0, name: 'Morphometric'}, name: 'Tibia IV length', description: 'tibia length of leg IV', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:91, abbrev:'Pat4', category: {id: 0, name: 'Morphometric'}, name: 'Patella IV length', description: 'patella length of leg IV', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:92, abbrev:'Fem4', category: {id: 0, name: 'Morphometric'}, name: 'Femur IV length', description: 'femur length of leg IV', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:93, abbrev:'Tro4', category: {id: 0, name: 'Morphometric'}, name: 'Trochanter IV length', description: 'trochanter length of leg IV', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:94, abbrev:'Cox4', category: {id: 0, name: 'Morphometric'}, name: 'Coxa IV length', description: 'coxa length of leg IV', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:95, abbrev:'amed', category: {id: 0, name: 'Morphometric'}, name: 'AME', description: 'mean diameter of anterior median eye', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:96, abbrev:'aled', category: {id: 0, name: 'Morphometric'}, name: 'ALE', description: 'mean diameter of anterior lateral eye', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:97, abbrev:'pled', category: {id: 0, name: 'Morphometric'}, name: 'PLE', description: 'mean diameter of posterior median eye', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:98, abbrev:'pmed', category: {id: 0, name: 'Morphometric'}, name: 'PME', description: 'mean diameter of posterior lateral eye', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:99, abbrev:'eyew', category: {id: 0, name: 'Morphometric'}, name: 'Eye region width', description: 'maximum width of eye region', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:100, abbrev:'pmsl', category: {id: 0, name: 'Morphometric'}, name: 'Spinneret PMS', description: 'total length of posteror median spinneret from mid basal to tip', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:101, abbrev:'plsl', category: {id: 0, name: 'Morphometric'}, name: 'Spinneret PLS', description: 'total length of posteror lateral spinneret from mid basal to tip', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:102, abbrev:'criw', category: {id: 0, name: 'Morphometric'}, name: 'Cribellum width', description: 'width of cribellum or colulus (0 if totally absent)', dataType: {id:0, name: 'real number'}, standard: 'in mm', reference: null},
{id:103, abbrev:'crib', category: {id: 0, name: 'Morphology'}, name: 'Cribellum', description: 'functional cribellum (with spinning field, which may be entire or divided) and calamistrum', dataType: {id:0, name: 'binary'}, standard: '', reference: null},
{id:104, abbrev:'eyes', category: {id: 0, name: 'Morphology'}, name: 'Eye number', description: 'number of eyes', dataType: {id:0, name: 'Integer'}, standard: 'no unit', reference: null},
{id:105, abbrev:'spin', category: {id: 0, name: 'Morphology'}, name: 'Spinnerets', description: 'number of functional spinnerets ', dataType: {id:0, name: 'integer'}, standard: '', reference: null},
{id:106, abbrev:'ente', category: {id: 0, name: 'Morphology'}, name: 'Entelegyn', description: 'presence of epigyne in females', dataType: {id:0, name: 'binary'}, standard: '', reference: null},
{id:107, abbrev:'vgsi', category: {id: 0, name: 'Anatomy'}, name: 'Venom gland size', description: 'volume of a venom gland', dataType: {id:0, name: 'real number'}, standard: 'in mm3', reference: null},
{id:108, abbrev:'brsi', category: {id: 0, name: 'Anatomy'}, name: 'Brain size', description: 'volume of CNS', dataType: {id:0, name: 'real number'}, standard: 'in mm3', reference: null},

]

export default {
    state: {
      data: [],
      total: 0
    },
    mutations: {
      traits(state, payload) {
        state.data = payload.value;
      },
      traitsTotal(state, payload) {
        state.total = payload.value;
      }
    },
    getters: {
        traits(state) {
            return state.data;
        },
        traitsTotal(state) {
            return state.total;
        }
    },
    actions: {
        traitsGetMockup: async function(context, payload) {
            console.log('traitsGet');
            
            console.dir(payload);
            var start = (payload.options.page - 1) * payload.options.itemsPerPage;
            var count = payload.options.itemsPerPage;

            console.log(start);
            console.log(count);
            

            var data = traits;
            if(payload.search) {
                data = data.filter(e => e.name.toLowerCase().indexOf(payload.search.toLowerCase()) > -1);
            }
            /*
            if(payload.options.sortBy) {
                data = data.sort((e1,e2) => {return e1.abbrev.localeCompare(e2.abbrev)});
            }*/
            /*
            await new Promise(function(resolve, reject) {
                window.setTimeout(() => resolve(), 3000)
            });
            */
            console.log(data.length);
            context.commit('traitsTotal', { value: data.length});
            console.dir(data);
            var filtered = data.slice(start, start+count);
            console.dir(filtered);
            context.commit('traits', { value: filtered});
        },

        traitsList: async function(context, payload) {
            console.log('traitsList');
            
            payload.endpoint = 'traits';
            payload.currCount = context.state.total;
            try {
                var data = await context.dispatch('get', payload);
                if(data.count) {
                    context.commit('traitsTotal', { value: data.count});
                }
                context.commit('traits', { value: data.items});
                } catch(err) {
                    console.error(err);
                }
        }
    },
    modules: {
    }
  }