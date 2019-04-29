SharkGame.HomeActions = {

    // FREEBIES ////////////////////////////////////////////////////////////////////////////////

    'catchFish': {
        name: "Catch fish",
        effect: {
            resource: {
                'fish': 1
            }
        },
        cost: {},
        prereq: {},
		outcomes: [ "Caught a fish" ],
        helpText: "Use your natural shark prowess to find and catch a fish."
    },

     // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

    'transmuteSharkonium': {
        name: "Transmute stuff to sharkonium",
        effect: {
            resource: {
                sharkonium: 1
            }
        },
        cost: [
            {resource: "crystal", costFunction: "constant", priceIncrease: 30},
            {resource: "sand", costFunction: "constant", priceIncrease: 50}
        ],
        max: "sharkonium",
        prereq: {
            upgrade: [
                "transmutation"
            ]
        },
        outcomes: [
            "Transmutation destination!",
            "Transmutation rejuvenation!",
            "Transmogrification revelation!",
            "Transformation libation!",
            "Transfiguration nation! ...wait.",
            "Sharkonium arise!",
            "Arise, sharkonium!",
            "More sharkonium!",
            "The substance that knows no name! Except the name sharkonium!",
            "The substance that knows no description! It's weird to look at.",
            "The foundation of a modern shark frenzy!"
        ],
        helpText: "Convert ordinary resources into sharkonium, building material of the future!"
    },

    // Acquire fish 
    

    'getShark': {
        name: "Recruit shark",
        effect: {
            resource: {
                'shark': 1
            }
        },
        cost: [
            {resource: "fish", costFunction: "linear", priceIncrease: 5}
        ],
        max: "shark",
        prereq: {
            resource: {
                'fish': 5
            }
        },
        outcomes: [
            "A bignose shark joins you."
        ],
        multiOutcomes: [
            "A whole bunch of sharks join you.",
            "That's a lot of sharks.",
            "The shark community grows!",
            "More sharks! MORE SHARKS!",
            "Sharks for the masses. Mass sharks.",
            "A shiver of sharks! No, that's a legit name. Look it up.",
            "A school of sharks!",
            "A shoal of sharks!",
            "A frenzy of sharks!",
            "A college of sharks! They're a little smarter than a school."
        ],
        helpText: "Recruit a shark to help catch more fish."
    },

    'getManta': {
        name: "Hire ray",
        effect: {
            resource: {
                'ray': 1
            }
        },
        cost: [
            {resource: "fish", costFunction: "linear", priceIncrease: 15}
        ],
        max: "ray",
        prereq: {
            resource: {
                'fish': 15
            }
        },
        outcomes: [
            "These guys seem to be kicking up a lot of sand!",
            "A spotted eagle ray joins you.",
            "A manta ray joins you.",
            "A stingray joins you.",
            "A clownnose ray joins you.",
            "A bluespotted maskray joins you.",
            "A bluntnose stingray joins you.",
            "A oman masked ray joins you.",
            "A bulls-eye electric ray joins you.",
            "A shorttailed electric ray joins you.",
            "A bentfin devil ray joins you.",
            "A lesser electric ray joins you.",
            "A cortez electric ray joins you.",
            "A feathertail stingray joins you.",
            "A thornback ray joins you.",
            "A giant shovelnose ray joins you.",
            "A pacific cownose ray joins you.",
            "A bluespotted ribbontail ray joins you.",
            "A marbled ribbontail ray joins you.",
            "A blackspotted torpedo ray joins you.",
            "A marbled torpedo ray joins you.",
            "A atlantic torpedo ray joins you.",
            "A panther torpedo ray joins you.",
            "A spotted torpedo ray joins you.",
            "A ocellated torpedo joins you.",
            "A caribbean torpedo joins you.",
            "A striped stingaree joins you.",
            "A sparesly-spotted stingaree joins you.",
            "A kapala stingaree joins you.",
            "A common stingaree joins you.",
            "A eastern fiddler ray joins you.",
            "A bullseye stingray joins you.",
            "A round stingray joins you.",
            "A yellow stingray joins you.",
            "A cortez round stingray joins you.",
            "A porcupine ray joins you.",
            "A sepia stingaree joins you.",
            "A banded stingaree joins you.",
            "A spotted stingaree joins you.",
            "A sea pancake joins you."
        ],
        multiOutcomes: [
            "A whole bunch of rays join you.",
            "That's a lot of rays.",
            "The ray conspiracy grows!",
            "I can't even deal with all of these rays.",
            "More rays more rays more more more.",
            "A school of rays!",
            "A fever of rays! Yes, seriously. Look it up.",
            "A whole lotta rays!",
            "The sand is just flying everywhere!",
            "So many rays."
        ],
        helpText: "Hire a ray to help collect fish. They might kick up some sand from the seabed."
    },


    'getCrab': {
        name: "Acquire crab",
        effect: {
            resource: {
                'crab': 1
            }
        },
        cost: [
            {resource: "fish", costFunction: "linear", priceIncrease: 10}
        ],
        max: "crab",
        prereq: {
            resource: {
                'shark': 4,
                'ray': 4
            }
        },
        outcomes: [
            "A crab starts sifting shiny things out of the sand.",
            "A bering hermit joins you.",
            "A blackeye hermit joins you.",
            "A butterfly crab joins you.",
            "A dungeness crab joins you.",
            "A flattop crab joins you.",
            "A greenmark hermit joins you.",
            "A golf-ball crab joins you.",
            "A graceful crab joins you.",
            "A graceful decorator crab joins you.",
            "A graceful kelp crab joins you.",
            "A green shore crab joins you.",
            "A heart crab joins you.",
            "A helmet crab joins you.",
            "A longhorn decorator crab joins you.",
            "A maroon hermit joins you.",
            "A moss crab joins you.",
            "A northern kelp crab joins you.",
            "A orange hairy hermit joins you.",
            "A purple shore crab joins you.",
            "A pygmy rock crab joins you.",
            "A puget sound king crab joins you.",
            "A red rock crab joins you.",
            "A scaled crab joins you.",
            "A sharpnose crab joins you.",
            "A spiny lithoid crab joins you.",
            "A widehand hermit joins you.",
            "A umbrella crab joins you."
        ],
        multiOutcomes: [
            "A lot of crabs join you.",
            "CRABS EVERYWHERE",
            "Crabs. Crabs. Crabs!",
            "Feels sort of crab-like around here.",
            "A cast of crabs!",
            "A dose of crabs!",
            "A cribble of crabs! Okay, no, that one's made up.",
            "So many crabs."
        ],
        helpText: "Hire a crab to find things that sharks and rays overlook."
    },

    'getShrimp': {
        name: "Acquire shrimp",
        effect: {
            resource: {
                'shrimp': 1
            }
        },
        cost: [
            {resource: "sponge", costFunction: "linear", priceIncrease: 5}
        ],
        max: "shrimp",
        prereq: {
            resource: {
                'sponge': 5
            },
            upgrade: [
                "seabedGeology"
            ]
        },
        outcomes: [
            "An african filter shrimp joins you.",
            "An amano shrimp joins you.",
            "A bamboo shrimp joins you.",
            "A bee shrimp joins you.",
            "A black tiger shrimp joins you.",
            "A blue bee shrimp joins you.",
            "A blue pearl shrimp joins you.",
            "A blue tiger shrimp joins you.",
            "A brown camo shrimp joins you.",
            "A cardinal shrimp joins you.",
            "A crystal red shrimp joins you.",
            "A dark green shrimp joins you.",
            "A glass shrimp joins you.",
            "A golden bee shrimp joins you.",
            "A harlequin shrimp joins you.",
            "A malaya shrimp joins you.",
            "A neocaridina heteropoda joins you.",
            "A ninja shrimp joins you.",
            "An orange bee shrimp joins you.",
            "An orange delight shrimp joins you.",
            "A purple zebra shrimp joins you.",
            "A red cherry shrimp joins you.",
            "A red goldflake shrimp joins you.",
            "A red tiger shrimp joins you.",
            "A red tupfel shrimp joins you.",
            "A snowball shrimp joins you.",
            "A sulawesi shrimp joins you.",
            "A tiger shrimp joins you.",
            "A white bee shrimp joins you.",
            "A yellow shrimp joins you."
        ],
        multiOutcomes: [
            "That's a lot of shrimp.",
            "So many shrimp, it's like a cloud!",
            "I can't cope with this many shrimp!",
            "Shrimp, they're like bugs, except not bugs or anything related at all!",
            "They're so tiny!",
            "How can something so small take up so much space?",
            "Sponge forever!"
        ],
        helpText: "Convince shrimp to assist you in the gathering of algae, which helps boost sponge production."
    },

    'getLobster': {
        name: "Gain lobster",
        effect: {
            resource: {
                'lobster': 1
            }
        },
        cost: [
            {resource: "clam", costFunction: "linear", priceIncrease: 10}
        ],
        max: "lobster",
        prereq: {
            resource: {
                'clam': 10
            },
            upgrade: [
                "seabedGeology"
            ]
        },
        outcomes: [
            "A scampi joins you.",
            "A crayfish joins you.",
            "A clawed lobster joins you.",
            "A spiny lobster joins you.",
            "A slipper lobster joins you.",
            "A hummer lobster joins you.",
            "A crawfish joins you.",
            "A rock lobster joins you.",
            "A langouste joins you.",
            "A shovel-nose lobster joins you.",
            "A crawdad joins you."
        ],
        multiOutcomes: [
            "Lobsters lobsters lobsters lobsters.",
            "But they weren't rocks...",
            "The clam forecast is looking good!",
            "They're all about the clams!",
            "More lobsters, because why not?",
            "HEAVY LOBSTERS",
            "More lobsters for the snipping and the cutting and the clam grab!",
            "Clam patrol, here we go."
        ],
        helpText: "Lobster like clams. Will work for clams. Good work. Many clams."
    },

    'getDolphin': {
        name: "Fetch dolphin",
        effect: {
            resource: {
                'dolphin': 1
            }
        },
        cost: [
            {resource: "fish", costFunction: "linear", priceIncrease: 10}
        ],
        max: "dolphin",
        prereq: {
            resource: {
                'fish': 10,
                'shark': 50
            },
            upgrade: [
                "cetaceanAwareness"
            ]
        },
        outcomes: [
            "A white beaked dolphin joins you.",
            "A short finned pilot whale joins you.",
            "A pantropical dolphin joins you.",
            "A long-finned pilot whale joins you.",
            "A hourglass dolphin joins you.",
            "A bottlenose dolphin joins you.",
            "A striped dolphin joins you.",
            "A pygmy killer whale joins you.",
            "A melon-headed whale joins you.",
            "An irrawaddy dolphin joins you.",
            "A dusky dolphin joins you.",
            "A clymene dolphin joins you.",
            "A black dolphin joins you.",
            "A southern right-whale dolphin joins you.",
            "A rough toothed dolphin joins you.",
            "A short beaked common dolphin joins you.",
            "A pacific white-sided dolphin joins you.",
            "A northern right-whale dolphin joins you.",
            "A long-snouted spinner dolphin joins you.",
            "A long-beaked common dolphin joins you.",
            "An atlantic white sided dolphin joins you.",
            "An atlantic hump-backed dolphin joins you.",
            "An atlantic spotted dolphin joins you."
        ],
        multiOutcomes: [
            "A pod of dolphins!",
            "More of them. Hm.",
            "More of these squeaky chatterers.",
            "More whiners.",
            "Do we need these guys?",
            "They have to be good for something."
        ],
        helpText: "Pay a dolphin to help us catch fish. Prepare to put up with whining."
    },

    'getWhale': {
        name: "Reach whale",
        effect: {
            resource: {
                'whale': 1
            }
        },
        cost: [
            {resource: "fish", costFunction: "linear", priceIncrease: 1e5}
        ],
        max: "whale",
        prereq: {
            resource: {
                'fish': 1e5
            },
            upgrade: [
                "cetaceanAwareness"
            ]
        },
        outcomes: [
            "A blue whale joins you.",
            "A pygmy blue whale joins you.",
            "A bowhead whale joins you.",
            "A fin whale joins you.",
            "A gray whale joins you.",
            "A humpback whale joins you.",
            "A southern minke whale joins you.",
            "A common minke whale  joins you.",
            "A dwarf minke whale joins you.",
            "A pygmy right whale joins you.",
            "A north right whale  joins you.",
            "A southern right whale joins you.",
            "A sei whale joins you.",
            "A beluga whale joins you.",
            "A sperm whale joins you.",
            "A pygmy sperm whale joins you.",
            "A dwarf sperm whale joins you."
        ],
        multiOutcomes: [
            "A pod of whales!",
            "Aloof, mysterious, big.",
            "So majestic. Wait, no, we're looking at a boulder formation.",
            "The songs are mesmerising.",
            "They might not all eat fish, but they're great at rounding them up."
        ],
        helpText: "Persuade one of the great whales to help us out. They can round up entire schools."
    },

    'getEel': {
        name: "Hire eel",
        effect: {
            resource: {
                'eel': 1
            }
        },
        cost: [
            {resource: "fish", costFunction: "linear", priceIncrease: 15}
        ],
        max: "eel",
        prereq: {
            resource: {
                'fish': 50
            },
            upgrade: [
                "seabedGeology"
            ]
        },
        outcomes: [
            "A false moray joins you.",
            "A mud eel joins you.",
            "A spaghetti eel joins you.",
            "A moray eel joins you.",
            "A thin eel joins you.",
            "A worm eel joins you.",
            "A conger joins you.",
            "A longneck eel joins you.",
            "A pike conger joins you.",
            "A duckbill eel joins you.",
            "A snake eel joins you.",
            "A snipe eel joins you.",
            "A sawtooth eel joins you.",
            "A cutthroat eel joins you.",
            "An electric eel joins you.",
            "A bobtail snipe eel joins you.",
            "A silver eel joins you.",
            "A long finned eel joins you.",
            "A short finned eel joins you."
        ],
        multiOutcomes: [
            "Eels combining elements of the sharks and the eels to create something not quite as good as either.",
            "The seabed sways with the arrival of new eels.",
            "Fish and sand go hand in hand with eels! Well, fin and fin.",
            "Don't mess with the creatures with jaws inside their jaws.",
            "Eel nation arise!",
            "That's a lot of eels.",
            "So there's more eels. Whee.",
            "The eels increase in number.",
            "More eels happened. Yay."
        ],
        helpText: "Offer a new home and fish supply to an eel. They can round up fish and sand."
    },

    'getChimaera': {
        name: "Procure chimaera",
        effect: {
            resource: {
                'chimaera': 1
            }
        },
        cost: [
            {resource: "jellyfish", costFunction: "linear", priceIncrease: 20}
        ],
        max: "chimaera",
        prereq: {
            resource: {
                'jellyfish': 20
            },
            upgrade: [
                "exploration"
            ]
        },
        outcomes: [
            "A ploughnose chimaera joins you.",
            "A cape elephantfish joins you.",
            "An australian ghost shark joins you.",
            "A whitefin chimaera joins you.",
            "A bahamas ghost shark joins you.",
            "A southern chimaera joins you.",
            "A longspine chimaera joins you.",
            "A cape chimaera joins you.",
            "A shortspine chimaera joins you.",
            "A leopard chimaera joins you.",
            "A silver chimaera joins you.",
            "A pale ghost shark joins you.",
            "A spotted ratfish joins you.",
            "A philippine chimaera joins you.",
            "A black ghostshark joins you.",
            "A blackfin ghostshark joins you.",
            "A marbled ghostshark joins you.",
            "A striped rabbitfish joins you.",
            "A large-eyed rabbitfish joins you.",
            "A spookfish joins you.",
            "A dark ghostshark joins you.",
            "A purple chimaera joins you.",
            "A pointy-nosed blue chimaera joins you.",
            "A giant black chimaera joins you.",
            "A smallspine spookfish joins you.",
            "A pacific longnose chimaera joins you.",
            "A dwarf sicklefin chimaera joins you.",
            "A sicklefin chimaera joins you.",
            "A paddle-nose chimaera joins you.",
            "A straightnose rabbitfish joins you."
        ],
        multiOutcomes: [
            "Many chimaeras come from the deep.",
            "Like ghosts, they come.",
            "The chimaeras avert your gaze, but set to work quickly.",
            "The jellyfish stocks shall climb ever higher!",
            "Well, it saves you the effort of braving the stinging tentacles.",
            "What have they seen, deep in the chasms?",
            "They aren't sharks, but they feel so familiar.",
            "The long-lost kindred return."
        ],
        helpText: "Convince a chimaera to hunt in the darker depths for us."
    },

    'getOctopus': {
        name: "Employ octopus",
        effect: {
            resource: {
                'octopus': 1
            }
        },
        cost: [
            {resource: "clam", costFunction: "linear", priceIncrease: 15}
        ],
        max: "octopus",
        prereq: {
            resource: {
                'clam': 20
            },
            upgrade: [
                "exploration"
            ]
        },
        outcomes: [
            "A capricorn night octopus joins you.",
            "A plain-body night octopus joins you.",
            "A hammer octopus joins you.",
            "A southern keeled octopus joins you.",
            "A two-spot octopus joins you.",
            "A caribbean reef octopus joins you.",
            "A southern white-spot octopus joins you.",
            "A bigeye octopus joins you.",
            "A carolinian octopus joins you.",
            "A lesser pacific striped octopus joins you.",
            "A chestnut octopus joins you.",
            "A big blue octopus joins you.",
            "A lilliput longarm octopus joins you.",
            "A red-spot night octopus joins you.",
            "A globe octopus joins you.",
            "A scribbled night octopus joins you.",
            "A bumblebee two-spot octopus joins you.",
            "A southern sand octopus joins you.",
            "A lobed octopus joins you.",
            "A starry night octopus joins you.",
            "A atlantic white-spotted octopus joins you.",
            "A maori octopus joins you.",
            "A mexican four-eyed octopus joins you.",
            "A galapagos reef octopus joins you.",
            "An ornate octopus joins you.",
            "A white-striped octopus joins you.",
            "A pale octopus joins you.",
            "A japanese pygmy octopus joins you.",
            "A east pacific red octopus joins you.",
            "A spider octopus joins you.",
            "A moon octopus joins you.",
            "A frilled pygmy octopus joins you.",
            "A tehuelche octopus joins you.",
            "A gloomy octopus joins you.",
            "A veiled octopus joins you.",
            "A bighead octopus joins you.",
            "A common octopus joins you.",
            "A club pygmy octopus joins you.",
            "A star-sucker pygmy octopus joins you.",
            "An atlantic banded octopus joins you."
        ],
        multiOutcomes: [
            "Efficiency increases with limb count.",
            "Hard to understand, but hardworking nonetheless.",
            "The minds of the octopuses are a frontier unbraved by many sharks.",
            "They hardly seem to notice you. They take their payment and begin to harvest.",
            "They say something about the schedule being on target.",
            "One of the new batch tells you to find unity in efficiency.",
            "You could have sworn you saw an octopus among the crowd glinting like metal."
        ],
        helpText: "Pay an octopus for their efficient clam retrieval services."
    },

    // WHALE JOBS ////////////////////////////////////////////////////////////////////////////////

    'getChorus': {
        name: "Assemble whale chorus",
        effect: {
            resource: {
                'chorus': 1
            }
        },
        cost: [
            {resource: "whale", costFunction: "unique", priceIncrease: 1000}
        ],
        max: "chorus",
        prereq: {
            resource: {
                'whale': 1
            },
            upgrade: [
                "eternalSong"
            ]
        },
        outcomes: [
            "The chorus is made.",
            "The singers sing an immortal tune.",
            "The song is indescribable.",
            "Serenity, eternity.",
            "What purpose does the song have?",
            "Liquid infinity swirls around the grand chorus."
        ],
        helpText: "Form the singers of the eternal song. Let it flow through this world."
    },

    // EEL JOBS ////////////////////////////////////////////////////////////////////////////////

    'getPit': {
        name: "Dig eel pit",
        effect: {
            resource: {
                'pit': 1
            }
        },
        cost: [
            {resource: "eel", costFunction: "constant", priceIncrease: 3},
            {resource: "fish", costFunction: "linear", priceIncrease: 50},
            {resource: "sand", costFunction: "linear", priceIncrease: 20}
        ],
        max: "pit",
        prereq: {
            resource: {
                'eel': 1
            },
            upgrade: [
                "eelHabitats"
            ]
        },
        outcomes: [
            "Why does it take three eels? Oh well. We don't really need to know.",
            "Dig that pit. We can dig it.",
            "Let's get digging.",
            "Oh, hey, this hole's already empty. Well, isn't that something."
        ],
        multiOutcomes: [
            "Let's get digging.",
            "Eel tide rises.",
            "More eels! They're handy to have.",
            "Many eyes from the caves.",
            "Secret homes!",
            "The eels are content."
        ],
        helpText: "Find a suitable pit for eels to make more eels."
    },

    'getTechnician': {
        name: "Teach eel technician",
        effect: {
            resource: {
                'technician': 1
            }
        },
        cost: [
            {resource: "eel", costFunction: "constant", priceIncrease: 1},
            {resource: "fish", costFunction: "linear", priceIncrease: 30},
            {resource: "crystal", costFunction: "linear", priceIncrease: 5}
        ],
        max: "technician",
        prereq: {
            resource: {
                'eel': 1
            },
            upgrade: [
                "eelHabitats"
            ]
        },
        outcomes: [
            "We have a technician!",
            "Technical problems no more!",
            "No, the eel won't fix your computer.",
            "Eel technician!"
        ],
        multiOutcomes: [
            "Let's get technical!",
            "Qualified and certified!",
            "Support squad on the rise!",
            "Let us not question the nature of eel technical training.",
            "Science progresses!"
        ],
        helpText: "Instruct an eel in the fine art of shark science."
    },

    'getSifter': {
        name: "Train eel sifter",
        effect: {
            resource: {
                'sifter': 1
            }
        },
        cost: [
            {resource: "eel", costFunction: "constant", priceIncrease: 1},
            {resource: "fish", costFunction: "linear", priceIncrease: 30}
        ],
        max: "sifter",
        prereq: {
            resource: {
                'eel': 1
            },
            upgrade: [
                "eelHabitats"
            ]
        },
        outcomes: [
            "Eel sifter ready to find things!",
            "Eel ready to sift through the sands!",
            "Time to sift, eel. Time to seek, search and sift.",
            "Time for this little guy to find some goodies."
        ],
        multiOutcomes: [
            "Time to find the things!",
            "Sift. It's a fun word. Siiiiffft.",
            "Sifters scouring the seabed for some special stuff.",
            "Shifters ready to shift! Wait. No. Hang on.",
            "Sifting the seabed for scores of surprises!"
        ],
        helpText: "Specialise an eel in finding interesting things on the seabed."
    },

    // CHIMAERA JOBS ////////////////////////////////////////////////////////////////////////////////

    'getTransmuter': {
        name: "Induct chimaera transmuter",
        effect: {
            resource: {
                'transmuter': 1
            }
        },
        cost: [
            {resource: "chimaera", costFunction: "constant", priceIncrease: 1},
            {resource: "jellyfish", costFunction: "linear", priceIncrease: 10},
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 10}
        ],
        max: "transmuter",
        prereq: {
            resource: {
                'chimaera': 1
            },
            upgrade: [
                "chimaeraMysticism"
            ]
        },
        outcomes: [
            "Transmuter taught.",
            "The chimaera's eyes flicker with power.",
            "The water glows around the chimaera.",
            "The chimaera forms the material of progress."
        ],
        multiOutcomes: [
            "The chimaeras are now masters of matter.",
            "The transmuters revel in our revealed secrets.",
            "The process continues.",
            "The matter matters.",
            "The immaterial made material."
        ],
        helpText: "Reveal the mysteries of transmutation to a chimaera."
    },

    'getExplorer': {
        name: "Prepare chimaera explorer",
        effect: {
            resource: {
                'explorer': 1
            }
        },
        cost: [
            {resource: "chimaera", costFunction: "constant", priceIncrease: 1},
            {resource: "jellyfish", costFunction: "linear", priceIncrease: 30},
            {resource: "crystal", costFunction: "linear", priceIncrease: 30}
        ],
        max: "explorer",
        prereq: {
            resource: {
                'chimaera': 1
            },
            upgrade: [
                "chimaeraMysticism"
            ]
        },
        outcomes: [
            "A seeker of mysteries is prepared.",
            "The chimaera explorer is ready for their journey.",
            "Explorer ready for some answers!",
            "The chimaera swims down to the ocean below."
        ],
        multiOutcomes: [
            "The exploration party is ready.",
            "Learn the secrets of the deeps!",
            "More mysteries to uncover.",
            "Ancient riddles for ancient creatures.",
            "Find the truth beneath the waves!"
        ],
        helpText: "Help prepare a chimaera for exploration to parts unknown. Their efforts will be good for science."
    },

    // OCTOPUS JOBS ////////////////////////////////////////////////////////////////////////////////

    'getCollector': {
        name: "Reassign octopus as collector",
        effect: {
            resource: {
                'collector': 1
            }
        },
        cost: [
            {resource: "octopus", costFunction: "constant", priceIncrease: 1},
            {resource: "clam", costFunction: "linear", priceIncrease: 50}
        ],
        max: "collector",
        prereq: {
            resource: {
                'octopus': 1
            },
            upgrade: [
                "octopusMethodology"
            ]
        },
        outcomes: [
            "An octopus is a collector now.",
            "Octopus, collector.",
            "The role has been assigned. Collector.",
            "The delegation has been made. Collector.",
            "This individual now collects."
        ],
        multiOutcomes: [
            "Collectors will retrieve that which has value to others.",
            "Collectors will collect what they feel is required.",
            "Collectors will begin their thankless harvest.",
            "Collectors will act as instructed."
        ],
        helpText: "Delegate an octopus to collect crystal and coral."
    },

    'getScavenger': {
        name: "Reassign octopus as scavenger",
        effect: {
            resource: {
                'scavenger': 1
            }
        },
        cost: [
            {resource: "octopus", costFunction: "constant", priceIncrease: 1},
            {resource: "clam", costFunction: "linear", priceIncrease: 30}
        ],
        max: "scavenger",
        prereq: {
            resource: {
                'octopus': 1
            },
            upgrade: [
                "octopusMethodology"
            ]
        },
        outcomes: [
            "An octopus is a scavenger now.",
            "Octopus, scavenger.",
            "The role has been assigned. Scavenger.",
            "The delegation has been made. Scavenger.",
            "This individual now scavenges."
        ],
        multiOutcomes: [
            "Scavengers will retrieve that which has value to their kind.",
            "Scavengers will scavenge what they can from below.",
            "Scavengers will pry the substrate of future progress from the ocean floor.",
            "Scavengers will act as instructed."
        ],
        helpText: "Delegate an octopus to scavenge sponge and sand."
    },

    // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

    'getCrystalMiner': {
        name: "Build crystal miner",
        effect: {
            resource: {
                'crystalMiner': 1
            }
        },
        cost: [
            {resource: "crystal", costFunction: "linear", priceIncrease: 100},
            {resource: "sand", costFunction: "linear", priceIncrease: 200},
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 20}
        ],
        max: "crystalMiner",
        prereq: {
            resource: {
                'sharkonium': 20
            },
            upgrade: [
                "automation"
            ]
        },
        outcomes: [
            "Crystal miner activated.",
            "Crystal miner constructed.",
            "Mining machine online.",
            "Construction complete.",
            "Carve rock. Remove sand. Retrieve target."
        ],
        multiOutcomes: [
            "The machines rise.",
            "The miners dig.",
            "The crystal shall be harvested.",
            "Crystal miners are complete."
        ],
        helpText: "Construct a machine to automatically harvest crystals efficiently."
    },

    'getSandDigger': {
        name: "Build sand digger",
        effect: {
            resource: {
                'sandDigger': 1
            }
        },
        cost: [
            {resource: "sand", costFunction: "linear", priceIncrease: 500},
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 150}
        ],
        max: "sandDigger",
        prereq: {
            resource: {
                'sharkonium': 150
            },
            upgrade: [
                "automation"
            ]
        },
        outcomes: [
            "Sand digger constructed.",
            "Sand digger reaches into the seabed.",
            "The digger begins to shuffle sand into its machine maw. Rays dart away.",
            "The machine is online.",
            "The machine acts immediately, shovelling sand."
        ],
        multiOutcomes: [
            "The machines increase in number.",
            "The diggers devour.",
            "All sand must be gathered.",
            "The rays are concerned.",
            "Devour the sands. Consume.",
            "Giant machines blot out our sun."
        ],
        helpText: "Construct a machine to automatically dig up sand efficiently."
    },

    'getFishMachine': {
        name: "Build fish machine",
        effect: {
            resource: {
                fishMachine: 1
            }
        },
        cost: [
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 100}
        ],
        max: "fishMachine",
        prereq: {
            resource: {
                'sharkonium': 100
            },
            upgrade: [
                "automation"
            ]
        },
        outcomes: [
            "Fish machine activated.",
            "Fish machine constructed.",
            "Fishing machine online.",
            "Construction complete.",
            "The quarry moves. But the machine is faster."
        ],
        multiOutcomes: [
            "One day there will be no fish left. Only the machines.",
            "Today the shark is flesh. Tomorrow, machine.",
            "Your metal servants can sate the hunger. The hunger for fish.",
            "The fishing machines are more efficient than the sharks. But they aren't very smart.",
            "Automated fishing.",
            "The power of many, many sharks, in many, many devices."
        ],
        helpText: "Construct a machine to automatically gather fish efficiently."
    },

    'getAutoTransmuter': {
        name: "Build auto-transmuter",
        effect: {
            resource: {
                'autoTransmuter': 1
            }
        },
        cost: [
            {resource: "crystal", costFunction: "linear", priceIncrease: 100},
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 200}
        ],
        max: "autoTransmuter",
        prereq: {
            resource: {
                'sharkonium': 200
            },
            upgrade: [
                "engineering"
            ]
        },
        outcomes: [
            "Auto-transmuter activated.",
            "Auto-transmuter constructed.",
            "Transmutation machine online.",
            "Construction complete.",
            "Provide inputs. Only the output matters."
        ],
        multiOutcomes: [
            "Auto-transmuters are prepared.",
            "The difference between science and magic is reliable application.",
            "All is change.",
            "Change is all.",
            "The machines know many secrets, yet cannot speak of them."
        ],
        helpText: "Construct a machine to automatically transmute sand and crystal to sharkonium."
    },

    'getSkimmer': {
        name: "Build skimmer",
        effect: {
            resource: {
                'skimmer': 1
            }
        },
        cost: [
            {resource: "junk", costFunction: "linear", priceIncrease: 300},
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 200}
        ],
        max: "skimmer",
        prereq: {
            resource: {
                'junk': 100
            },
            upgrade: [
                "engineering"
            ]
        },
        outcomes: [
            "Skimmer activated.",
            "Skimmer constructed.",
            "Residue producer online.",
            "Construction complete.",
            "Sacrifices must be made for progress."
        ],
        multiOutcomes: [
            "The lesser resource becomes the greatest of all.",
            "Transmutation is limited. The recycler is greater.",
            "Consumption and production are two halves of the greater whole.",
            "The creations of sharks emerge from a pattern as old as their species."
        ],
        helpText: "Construct a machine to automatically recycle kelp and sand into residue."
    },

    'getPurifier': {
        name: "Build purifier",
        effect: {
            resource: {
                'purifier': 1
            }
        },
        cost: [
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 500}
        ],
        max: "purifier",
        prereq: {
            resource: {
                'sharkonium': 500
            },
            upgrade: [
                "environmentalism"
            ]
        },
        outcomes: [
            "Purifier activated.",
            "Purifier constructed.",
            "Machine gills online.",
            "Construction complete.",
            "Not all machines carry such weight."
        ],
        multiOutcomes: [
            "We can almost hear these machines as they start. We can hear them speak. \"We will save you from your mistakes.\" No, I'm just, must be hearing things, ignore me.",
            "The problems of old will be solved by the new.",
            "The waters will return to clarity.",
            "The machines may destroy, but so too can they heal and repair.",
            "The end is not nearly so soon.",
            "Hope."
        ],
        helpText: "Construct a machine to restore vitality to our increasingly murky waters."
    },

    'getHeater': {
        name: "Build heater",
        effect: {
            resource: {
                'heater': 1
            }
        },
        cost: [
            {resource: "sharkonium", costFunction: "linear", priceIncrease: 300}
        ],
        max: "heater",
        prereq: {
            resource: {
                'ice': 1,
                'sharkonium': 300
            },
            upgrade: [
                "thermalConditioning"
            ]
        },
        outcomes: [
            "Heater activated.",
            "Heater constructed.",
            "Climate control online.",
            "Construction complete.",
            "The end of ice."
        ],
        multiOutcomes: [
            "The ice age comes to a close.",
            "Is this replacing one form of destruction for another?",
            "Life becomes easier.",
            "The warmth. The warmth we desired so much.",
            "Life returns to the frozen sea.",
            "This world awakens."
        ],
        helpText: "Construct a machine to combat the advancing ice shelf."
    },

    // CRUSTACEAN MACHINES /////////////////////////////////////////////////////////

    'getSpongeFarmer': {
        name: "Build sponge farmer",
        effect: {
            resource: {
                'spongeFarmer': 1
            }
        },
        cost: [
            {resource: "coralglass", costFunction: "linear", priceIncrease: 200}
        ],
        max: "spongeFarmer",
        prereq: {
            resource: {
                'coralglass': 200
            },
            upgrade: [
                "coralCircuitry"
            ]
        },
        outcomes: [
            "Sponge farmer is active.",
            "Sponge farmer capable.",
            "This sponge farming machine clatters to life.",
            "This automated caretaker gets to work."
        ],
        multiOutcomes: [
            "Sponges are not hard to domesticate. It's harder to make them wild.",
            "The shrimp will be happier.",
            "There is something missing compared to our machines. Ours are slightly more menacing, but also more effective.",
            "Who needs this much sponge?"
        ],
        helpText: "This crustacean machine automatically farms and harvests sponge."
    },

    'getBerrySprayer': {
        name: "Build berry sprayer",
        effect: {
            resource: {
                'berrySprayer': 1
            }
        },
        cost: [
            {resource: "coralglass", costFunction: "linear", priceIncrease: 500}
        ],
        max: "berrySprayer",
        prereq: {
            resource: {
                'coralglass': 500,
                'lobster': 2
            },
            upgrade: [
                "coralCircuitry"
            ]
        },
        outcomes: [
            "Berry sprayer is active.",
            "Berry sprayer capable.",
            "This egg spraying machine clatters to life.",
            "This automated caretaker gets to work." // yeah, it's lazy, I know, but still just as appropriate
        ],
        multiOutcomes: [
            "Automation of population? What a terrifying concept.",
            "The machine rears lobster eggs. Wouldn't the shrimp want something like this too?",
            "There is an uneasiness about these machines that fills the sharks with concern.",
            "Why was this machine invented? Are we helping to prepare an army?"
        ],
        helpText: "This crustacean machine distributes lobster eggs for optimal hatching conditions."
    },

    'getGlassMaker': {
        name: "Build glass maker",
        effect: {
            resource: {
                'glassMaker': 1
            }
        },
        cost: [
            {resource: "coralglass", costFunction: "linear", priceIncrease: 400},
            {resource: "sand", costFunction: "linear", priceIncrease: 200},
            {resource: "coral", costFunction: "linear", priceIncrease: 200}
        ],
        max: "glassMaker",
        prereq: {
            resource: {
                'coralglass': 400
            },
            upgrade: [
                "coralCircuitry"
            ]
        },
        outcomes: [
            "Glass maker is active.",
            "Glass maker capable.",
            "This glass forging machine clatters to life.",
            "The coralglass factory whirrs and boils."
        ],
        multiOutcomes: [
            "Coralglass. The sharkonium of the shelled kind.",
            "The raw heat from these things could boil the ocean dry. How they do it, we don't know.",
            "Coralglass. So fragile, so beautiful, yet so durable. They make the machines in their own image.",
            "The fine intricacies of these machines are lost on us, given how much of our technological development involves our mouths."
        ],
        helpText: "This crustacean machine automatically makes coralglass out of coral and sand through processes we don't fully understand."
    },

    // DOLPHIN MACHINES /////////////////////////////////////////////////////////

    'getSilentArchivist': {
        name: "Build silent archivist",
        effect: {
            resource: {
                'silentArchivist': 1
            }
        },
        cost: [
            {resource: "delphinium", costFunction: "linear", priceIncrease: 300},
            {resource: "science", costFunction: "linear", priceIncrease: 200}
        ],
        max: "silentArchivist",
        prereq: {
            resource: {
                'delphinium': 300
            },
            upgrade: [
                "dolphinTechnology"
            ]
        },
        outcomes: [
            "Silent archivist watches on.",
            "Silent archivist shows no bias.",
            "Silent archivist makes a note.",
            "Silent archivist views us with disdain."
        ],
        multiOutcomes: [
            "More archivers of our grand works as a collective.",
            "These machines share the same insights as their creators, but are much less painful to deal with.",
            "The design for these machines seems strangely familiar.",
            "These things are too silent. We aren't sure if they're even on.",
            "Science is nothing without review."
        ],
        helpText: "This dolphin machine archives, critiques, and catalogues our science."
    },

    'getTirelessCrafter': {
        name: "Build tireless crafter",
        effect: {
            resource: {
                'tirelessCrafter': 1
            }
        },
        cost: [
            {resource: "delphinium", costFunction: "linear", priceIncrease: 200},
            {resource: "crystal", costFunction: "linear", priceIncrease: 200},
            {resource: "coral", costFunction: "linear", priceIncrease: 200}
        ],
        max: "tirelessCrafter",
        prereq: {
            resource: {
                'delphinium': 200
            },
            upgrade: [
                "dolphinTechnology"
            ]
        },
        outcomes: [
            "Tireless crafter fuses the matter.",
            "Tireless crafter never ceases.",
            "Tireless crafter lays foundation for a future.",
            "Tireless crafter is an accident waiting to happen."
        ],
        multiOutcomes: [
            "Delphinium. The warped counterpart to sharkonium.",
            "A silent, heatless process, much like the auto-transmuter's method of operation.",
            "Delphinium. We don't understand it. It feels a lot like sharkonium, but warmer.",
            "The complexity of these machines is unwarranted. The dolphins think themselves smarter, but we have simpler, more effective solutions."
        ],
        helpText: "This dolphin machine creates delphinium. What good that is to us is a mystery. Use it to make their useless machines, I guess?"
    },

    // OCTOPUS MACHINES /////////////////////////////////////////////////////////

    'getClamCollector': {
        name: "Build clam collector",
        effect: {
            resource: {
                'clamCollector': 1
            }
        },
        cost: [
            {resource: "spronge", costFunction: "linear", priceIncrease: 50}
        ],
        max: "clamCollector",
        prereq: {
            resource: {
                'spronge': 50
            },
            upgrade: [
                "sprongeBiomimicry"
            ]
        },
        outcomes: [
            "Machine: clam collector. Operation: in progress.",
            "Machine: clam collector. Operation: beginning.",
            "Machine: clam collector. Result: clam collection.",
            "Machine: clam collector. Result: food for the masses."
        ],
        multiOutcomes: [
            "These machines feel strangely alive. They pulse and throb.",
            "There exist more clam collectors now.",
            "The biomachine expands.",
            "The octopuses tell me, find unity in efficiency. Find peace in automation."
        ],
        helpText: "This octopus machine collects clams. Simple purpose, simple machine."
    },

    'getEggBrooder': {
        name: "Build egg brooder",
        effect: {
            resource: {
                'eggBrooder': 1
            }
        },
        cost: [
            {resource: "spronge", costFunction: "linear", priceIncrease: 150},
            {resource: "octopus", costFunction: "constant", priceIncrease: 1}
        ],
        max: "eggBrooder",
        prereq: {
            resource: {
                'spronge': 150,
                'octopus': 10
            },
            upgrade: [
                "sprongeBiomimicry"
            ]
        },
        outcomes: [
            "Machine: egg brooder. Operation: in progress.",
            "Machine: egg brooder. Operation: beginning.",
            "Machine: egg brooder. Result: egg maintenance.",
            "Machine: egg brooder. Result: population rises.",
            "Machine: egg brooder. Cost: within acceptable parameters."
        ],
        multiOutcomes: [
            "These machines feel strangely alive. They pulse and throb.",
            "There exist more egg brooders now.",
            "The biomachine expands.",
            "The octopuses tell me, find unity in efficiency. Find peace in an optimised generation."
        ],
        helpText: "This octopus machine broods and incubates octopus eggs."
    },

    'getSprongeSmelter': {
        name: "Build spronge smelter",
        effect: {
            resource: {
                'sprongeSmelter': 1
            }
        },
        cost: [
            {resource: "spronge", costFunction: "linear", priceIncrease: 100}
        ],
        max: "sprongeSmelter",
        prereq: {
            resource: {
                'spronge': 100
            },
            upgrade: [
                "sprongeBiomimicry"
            ]
        },
        outcomes: [
            "Machine: spronge smelter. Operation: in progress.",
            "Machine: spronge smelter. Operation: beginning.",
            "Machine: spronge smelter. Result: spronge smelting.",
            "Machine: spronge smelter. Result: further development."
        ],
        multiOutcomes: [
            "These machines feel strangely alive. They pulse and throb.",
            "There exist more spronge smelters now.",
            "The biomachine expands.",
            "The octopuses tell me, find unity in efficiency. Find peace in an assured future."
        ],
        helpText: "This octopus machine imbues sponge with industrial potential. Requires residue for function."
    },

    'getSeaScourer': {
        name: "Build sea scourer",
        effect: {
            resource: {
                'seaScourer': 1
            }
        },
        cost: [
            {resource: "spronge", costFunction: "linear", priceIncrease: 100},
            {resource: "junk", costFunction: "linear", priceIncrease: 50}
        ],
        max: "seaScourer",
        prereq: {
            resource: {
                'spronge': 100,
                'tar': 1
            },
            upgrade: [
                "sprongeBiomimicry"
            ]
        },
        outcomes: [
            "Machine: sea scourer. Operation: in progress.",
            "Machine: sea scourer. Operation: beginning.",
            "Machine: sea scourer. Result: pollution conversion.",
            "Machine: sea scourer. Result: appropriating inefficiency."
        ],
        multiOutcomes: [
            "These machines feel strangely alive. They pulse and throb.",
            "There exist more sea scourers now.",
            "The biomachine expands.",
            "The octopuses tell me, find unity in efficiency. Find peace in the impermanence of mistakes."
        ],
        helpText: "This octopus machine converts pollution into more useful resources."
    },

    'getProstheticPolyp': {
        name: "Build prosthetic polyp",
        effect: {
            resource: {
                'prostheticPolyp': 1
            }
        },
        cost: [
            {resource: "spronge", costFunction: "linear", priceIncrease: 100},
            {resource: "coral", costFunction: "linear", priceIncrease: 50}
        ],
        max: "prostheticPolyp",
        prereq: {
            resource: {
                'spronge': 100,
                'coral': 50
            },
            upgrade: [
                "sprongeBiomimicry"
            ]
        },
        outcomes: [
            "Machine: prosthetic polyp. Operation: in progress.",
            "Machine: prosthetic polyp. Operation: beginning.",
            "Machine: prosthetic polyp. Result: coral generation.",
            "Machine: prosthetic polyp. Result: ecosystem restabilisation."
        ],
        multiOutcomes: [
            "These machines feel strangely alive. They pulse and throb.",
            "There exist more prosthetic polyps now.",
            "The biomachine expands.",
            "The octopuses tell me, find unity in efficiency. Find peace in creation."
        ],
        helpText: "This octopus machine synthesizes coral faster than an entire colony of polyps ever could."
    }

};

SharkGame.HomeActionCategories = {

    all: { // This category should be handled specially.
        name: "All",
        actions: []
    },

    basic: {
        name: "Basic",
        actions: [
            "catchFish"
        ]
    },

    frenzy: {
        name: "Frenzy",
        actions: [
        ]
    },

    professions: {
        name: "Jobs",
        actions: [
        ]
    },

    breeders: {
        name: "Producers",
        actions: [
        ]
    },

    processing: {
        name: "Processing",
        actions: [
        ]
    },

    machines: {
        name: "Shark Machines",
        actions: [
        ]
    },

    otherMachines: {
        name: "Other Machines",
        actions: [
        ]
    },

    unique: {
        name: "Unique",
        actions: [
            "getChorus"
        ]
    }
};
