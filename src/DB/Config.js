const Settings = {

    'quiz': {
        type: 'image', // image or sound type of Questions.
        optionLength: 4, // number of options in Quiz.
        chosenList: '', // custom/premade list name to make the quiz for.
    },
    'location': {},
    



};
const Links = [ // TEMPporary.
    {id: 1, name: 'Golden Eagle', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/GC-912-Aquila_chrysaetos.jpg", "https://www.natureinstruct.org/files/avian_images/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/JN-909-Aquila_chrysaetos.mp3", "https://www.natureinstruct.org/files/avian_songs/KJC-910-Aquila_chrysaetos.mp3"]}
    },
    {id: 2, name: 'American Golden-Plover', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/MP-1669-Pluvialis_dominica.jpg", "https://www.natureinstruct.org/files/avian_images/PAS-1664-Pluvialis_dominica.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/MB-1659-Pluvialis_dominica.mp3", "https://www.natureinstruct.org/files/avian_songs/BE-1660-Pluvialis_dominica.mp3"]}
    },
    {id: 3, name: 'Common Ringed Plover', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/76169-Charadrius_hiaticula_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/76163-Charadrius_hiaticula_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/ML-1685-Charadrius_hiaticula.mp3", "https://www.natureinstruct.org/files/avian_songs/xenocanto/62793-Charadrius_hiaticula_AOU_7_52-xcfile.mp3"]}
    },
    {id: 4, name: 'Semipalmated Plover', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/PA-1687-Charadrius_semipalmatus.mp3", "https://www.natureinstruct.org/files/avian_songs/TM2-1688-Charadrius_semipalmatus.mp3"]}
    },
    {id: 5, name: 'Spotted Sandpiper', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/72902-Actitis_macularius_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/KN-1365-Actitis_macularius.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/MB-1357-Actitis_macularius.mp3", "https://www.natureinstruct.org/files/avian_songs/MB-1358-Actitis_macularius.mp3"]}
    },
    {id: 6, name: 'Surfbird', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/RH-1442-Aphriza_virgata.jpg", "https://www.natureinstruct.org/files/avian_images/JD2-9158-Aphriza_virgata.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/TM2-1436-Aphriza_virgata.mp3", "https://www.natureinstruct.org/files/avian_songs/MB-1437-Aphriza_virgata.mp3"]}
    },
    {id: 7, name: 'Black-throated Green Warbler', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/78325-Setophaga_virens_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/CMF-9382-Dendroica_virens.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/ML-4167-Dendroica_virens.mp3", "https://www.natureinstruct.org/files/avian_songs/ML-4168-Dendroica_virens.mp3"]}
    },
    {id: 8, name: 'Gray-crowned Rosy-Finch', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/AM-3862-Leucosticte_tephrocotis.jpg", "https://www.natureinstruct.org/files/avian_images/AM-3862-Leucosticte_tephrocotis.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/ML-3860-Leucosticte_tephrocotis.mp3", "https://www.natureinstruct.org/files/avian_songs/ML-3861-Leucosticte_tephrocotis.mp3"]}
    },
    {id: 9, name: 'Merlin', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/TB2-119938-Falco_columbarius_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/TB2-119939-Falco_columbarius_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/MB-933-Falco_columbarius.mp3", "https://www.natureinstruct.org/files/avian_songs/CM-934-Falco_columbarius.mp3"]}
    },
    {id: 10, name: 'Eurasian Collared-Dove', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/87129-Streptopelia_decaocto_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/CMF-7788-Streptopelia_decaocto.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/TP-9125-Streptopelia_decaocto.mp3", "https://www.natureinstruct.org/files/avian_songs/xenocanto/66734-Streptopelia_decaocto_AOU_7_52-xcfile.mp3"]}
    },
    {id: 11, name: 'Rufous Hummingbird', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/TB2-14343-Selasphorus_rufus.jpg", "https://www.natureinstruct.org/files/avian_images/TB2-14945-Selasphorus_rufus.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/JN-2516-Selasphorus_rufus.mp3", "https://www.natureinstruct.org/files/avian_songs/LE-2517-Selasphorus_rufus.mp3"]}
    },
    {id: 12, name: 'Western Tanager', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/LM-9392-Piranga_ludoviciana.jpg", "https://www.natureinstruct.org/files/avian_images/84683-Piranga_ludoviciana_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/JN-4896-Piranga_ludoviciana.mp3", "https://www.natureinstruct.org/files/avian_songs/JN-4897-Piranga_ludoviciana.mp3"]}
    },
    {id: 13, name: 'Belted Kingfisher', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/76042-Megaceryle_alcyon_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/76043-Megaceryle_alcyon_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/MB-2529-Megaceryle_alcyon.mp3", "https://www.natureinstruct.org/files/avian_songs/JN-2531-Megaceryle_alcyon.mp3"]}
    },
    {id: 14, name: 'King Rail', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/85699-Rallus_elegans_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/85703-Rallus_elegans_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/LE-1128-Rallus_elegans.mp3", "https://www.natureinstruct.org/files/avian_songs/BLB-1130-Rallus_elegans.mp3"]}
    },
    {id: 15, name: 'Atlantic Puffin', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/JR-2122-Fratercula_arctica.jpg", "https://www.natureinstruct.org/files/avian_images/JR-2122-Fratercula_arctica.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/LE-2118-Fratercula_arctica.mp3", "https://www.natureinstruct.org/files/avian_songs/LE-2119-Fratercula_arctica.mp3"]}
    },
    {id: 16, name: 'Red-eyed Vireo', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/KB3-120319-Vireo_olivaceus_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/JR-3077-Vireo_olivaceus.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/ML-3069-Vireo_olivaceus.mp3", "https://www.natureinstruct.org/files/avian_songs/DJK-3072-Vireo_olivaceus.mp3"]}
    },
    {id: 17, name: "Chuck-will's-widow", 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/TB-7827-Caprimulgus_carolinensis.jpg", "https://www.natureinstruct.org/files/avian_images/75612-Caprimulgus_carolinensis_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/MB-2443-Caprimulgus_carolinensis.mp3", "https://www.natureinstruct.org/files/avian_songs/LE-2445-Caprimulgus_carolinensis.mp3"]}
    },
    {id: 18, name: 'Loggerhead Shrike', 
        image: {uris: ["https://www.natureinstruct.org/files/avian_images/TB2-120039-Lanius_ludovicianus_AOU_7_52.jpg", "https://www.natureinstruct.org/files/avian_images/81029-Lanius_ludovicianus_AOU_7_52.jpg"]}, 
        sound: {uris: ["https://www.natureinstruct.org/files/avian_songs/BLB-3101-Lanius_ludovicianus.mp3", "https://www.natureinstruct.org/files/avian_songs/ML-3105-Lanius_ludovicianus.mp3"]}
    },
]


export default {

    Settings,
    Links,
};