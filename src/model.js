const model = {
    app:{
        currentView:'frontPage',
        loggedInStatus: false,
        wrongUserNamePasswordMessage: '',
        userId:false,
        zoomedPic:false,
        currentProduct:false,
        showChatBox:"",
        frontPageCurrentShowing:{
            top:0,
            bottom:0,
            topPic:0,
            botPic:0
        },
        checkOut: {
            invalidEmailOnCheckOutPage: false,
        },
        pagesToNavigateTo: [],
        indexOfThePageAreOn: 0,
        
    },
    inputs:{
        adminMembersPage:{
            selectedUsersId: false,
            messageToUser: '',
        },
        shoppingCart: {
            items: {
                canBuyNow: [
                    {id: "000001",quantity:1},
                    {id: "000002",quantity:1},
                ],
                auctions: {
                    usersWinningBids:[],
                    usersLosingBids:[],
                    increasedWinningBid: 0,
                },
            },
            totalPrice: 0,
        },
        register: {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            userName: '',
            password: '',
            repeatPassword: '',
            address: '',
            zip: '',
            city: '',
            cardNumber: '',
            fromDate: '',
            toDate: '',
            cvc: '' ,
            meldingRegister:'', 
            cardAddress:'',
            cardZip:'',
            cardCity:'',
            cardFirstName:'',
            cardLastName:'',              
        },
        login:{
            username:"",
            password:"",
            dropdown:false,
            wrongUserNamePassword: false,

        },
        adminAuctionPage:{
            searchInput: '',
            selectedItemId: null,
            messageToUsers: '',
            userIdsToSendMessage: [],
            itemsUtløptFrist: [],
            selectedUtløptFristItemsId: null,
            alreadyInShoppingCart: false,
        },
        chatBox:{
            message:""
        },
        checkOutPage: {
            emptyShoppingCart: false,
            totalPrice: 0,
            firstName: '',
            lastName: '',
            address: '',
            zipCode: '',
            email: '',
            mobile: '',
            addressFilled: false,
            selectedDeliveryMethod: '',
            frakt: 0,
            deliveryMethod: {
                selected: false,
                butikk: '',
                leveringMedInnbæring: '',
                leveringUtenInnbæring: ''
            },
            cardNumber: '',
            expirationDate: '',
            cvc: '',
            cardHolderFirstName: '',
            cardHolderLastName: '',
            addNewCard: false,
        },
        register: {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            userName: '',
            password: '',
            repeatPassword: '',
            address: '',
            zip: '',
            city: '',
            cardNumber: '',
            fromDate: '',
            toDate: '',
            cvc: '' ,
            meldingRegister:'', 
            cardAddress:'',
            cardZip:'',
            cardCity:'',
            cardFirstName:'',
            cardLastName:'',              
        },
        login:{
            username:"",
            password:"",
            dropdown:false,
            wrongUserNamePassword: false,
        },
        category:{
            filteredItemsAdmin:[],
            filteredItems:[],
            priceRange:{
                max:0,
                min:0
            },
            filterAuctionCheck:true,
            filterNormalCheck:true,
            categoryList:[
                
            ]     
        },
        createSale: {
            title:'',
            description:'',
            price:'',
            minimumBid:false,
            minimumBidAmmount:'',
            auction:true,
            deadline:'',
            images:[],
            deliver:false,
            frontPage:false,
            categoryList: [""], 
            mainCategory : '',
            subCategory : '',
            mainImage: '',
            addImage: '',
        },
        search:{
            input:'',                
        },
        profileMenuShowing:false,
        product:{
            bidIncrease:"",
            adminBidIncrease:0,
            adminPriceChange:0,
            adminAddSubCategory:"",
            adminChangeMainCategory:""
        },
        adminMessagePage:{
            adminMessage: ''
        },
        adminFrontPage:{
            productSearch:"",
            showTopList: false,
            showBotList: false
        }
    },
    data:{
        frontPageTop:[1],
        frontPageBottom:[0,2],
        users:{
            "0000001":{
                id:"0000001",
                username:"admin",
                password:"admin",
                permissions:"admin",
                firstName:"Elin",
                surName:"Herlev Christoffersen",
                address:"GeTOutOfMyVei",
                city:"Larvik",
                zip:"1482",
                email:"example@gmail.com",
                mobile:'00000000',    
            },
            "0000002":{
                id:"0000002",
                username:"MarKod",
                password:"ikkeadmin",
                permissions:"user",
                firstName:"Marie",
                surName:"Kodensen",
                address:"Jernbanegata 6",
                city:"Ålesund",
                zip:"6003",
                email: 'mariek@gmail.com',
                mobile: '48263574',
                shoppingCart:[
                        {
                            item:"000001",
                            quantity:1
                        },
                    ],
            
                paymentInformation:[
                    {
                        cardNumber: "133783082430",
                        expirationDate:"12/25",
                        cvc: '622',
                        cardHolderFirstName:"Marie",
                        cardHolderLastName:"Kodensen",
                        address:"Jernbanegata 6",
                        houseNumber:"6",
                        zip:"6003",
                        cvc:"622",
                        city: "Ålesund"
                    },
                ],
                messages:[
                    {
                        type:'user',
                        message: 'hei, jeg er Marie!',
                    },
                    {
                        type:'admin',
                        message: 'hei Marie!',
                    }, 
                ]         
            },
            "0000003":{
                id:"0000003",
                username:"tommy",
                password:"tommy",
                permissions:"user",
                firstName:"Tommy",
                surName:"Jensen",
                address:"Storgata 3",
                city:"Molde",
                zip:"6409",
                email: 'tommyj@gmail.com',
                mobile: '48304564',
                shoppingCart:[
                        {
                            item:"000001",
                            quantity:1
                        },
                    ],
            
                paymentInformation:[
                    {
                        cardNumber: "133780082420",
                        expirationDate:"12/25",
                        cvc: '552',
                        cardHolderFirstName:"Tommy",
                        cardHolderLastName:"Jensen",
                        address:"Storgata 3",
                        houseNumber:"3",
                        zip:"6409",
                        cvc:"552",
                        city: "Molde"
                    },
                ],
                messages:[
                    {
                        type:'user',
                        message: 'hei, har du mer kunst til salgs?',
                    },
                    {
                        type:'admin',
                        message: 'hei, skal sjekke på lager',
                    }, 
                ]         
            },
            "0000004":{
                id:"0000004",
                username:"bigbryan",
                password:"bigbryan",
                permissions:"user",
                firstName:"Bryan",
                surName:"Adams",
                address:"Queen Street 3",
                city:"Toronto",
                zip:"M5H 2N1",
                email: 'bigbryan@gmail.com',
                mobile: '48314564',
                shoppingCart:[
                        {
                            item:"000001",
                            quantity:1
                        },
                    ],
            
                paymentInformation:[
                    {
                        cardNumber: "134520082420",
                        expirationDate:"12/25",
                        cvc: '561',
                        cardHolderFirstName:"Bryan",
                        cardHolderLastName:"Adams",
                        address:"Queen Street 3",
                        houseNumber:"3",
                        zip:"M5H 2N1",
                        cvc:"561",
                        city: "Toronto"
                    },
                ],
                messages:[
                    {
                        type:'user',
                        message: 'Hello. Do you have any more Vintage Guitars for sale?',
                    },
                    {
                        type:'admin',
                        message: 'I do not have any now but I am going to order a few soon.',
                    },
                    {
                        type:'user',
                        message: 'Aw, that\'s too bad, could you send me a message once they get in?',
                    },
                ]         
            }
        },
        orderHistory: [
            {

                itemId:"000003",
                paid: true,
                price:'15000',
                date:'03/01/2023',
                type: 'direkte',
                userId: '0000002',
                image : 'https://genbrugsauktion.dk/wp-content/uploads/IMG_0038-97-520x347.jpg',
                title: 'Antikke sølvsmykker'
            },
            {
                itemId:"000004",
                paid: true,
                price:'10000',
                date:'03/01/2023',
                type: 'direkte',
                userId: '0000002',
                image : 'https://images.lauritz.com/images/BCA3EF612A3B993C2D51F822302F65D7',
                title: 'Klassisk vinylsamling'
            },
        ],
        auctionListe: [
            {
                itemId: '000002',
                bids: {
                        '0000002': {bid: [1000, 20000], deleted: false, autoBid:0, vunnet:true},
                        '0000001': {bid: [1000, 10000], deleted: false, autoBid:0, vunnet:false}
                    },
            },
        ],

        items:[
            {
                id: "000001",
                title: 'Storbritannias kronjuveler',
                description: 'Storbritannias kronjuveler er en samling av dyrebare kroner, sceptere, septre, kjeder og andre smykker som blir brukt under kroningen av monarken. Juvelene har en lang historie og er en viktig del av den britiske kulturarven.',
                price: 70000,
                originalPrice:70000,
                category:['Småting','Tilbehør'],
                auction:false,
                deadline:'2023-03-21T18:21',
                images:['assets/kronebilde1.jpg','assets/kronebilde2.jpg'],
                inStock:true,
                deliver:true,
                mainImage: '',
                minBid:0
            },
            {
                id: "000002",
                title: 'Bord og stolsett',
                description: 'Et elegant og funksjonelt bord og stolsett som passer perfekt til både spisestuen og kjøkkenet. Bordet er laget av solid eik og har en vakker finish, mens stolene har komfortable seter og ryggstøtte. Dette settet er ideelt for både daglig bruk og spesielle anledninger.',
                price: 20000,
                originalPrice:5000,
                category:['Møbler','Stoler','Bord'],
                auction:true,
                deadline:'2024-04-28T10:13',
                images:['https://img.tradera.net/images/902/345913902_a2eb9c41-1683-4535-a336-6aa79e211c70.jpg','https://i.pinimg.com/originals/53/00/d1/5300d17610ce6dc3b78c3b895c649e7e.jpg'],
                inStock:true,
                deliver:false,
                minBid:300
            },
            {
                id: "000003",
                title: 'Antikke sølvsmykker',
                description: 'En vakker samling av antikke sølvsmykker fra forskjellige epoker og kulturer. Smykkene inkluderer ringer, armbånd, halskjeder og øreringer i ulike stiler og designs. Disse unike og tidløse smykkene er et perfekt tillegg til enhver smykkesamling.',
                price: 15000,
                originalPrice:15000,
                category:['Smykker','Antikviteter'],
                auction:false,
                deadline:'',
                images:['https://genbrugsauktion.dk/wp-content/uploads/IMG_0038-97-520x347.jpg','https://genbrugsauktion.dk/wp-content/uploads/IMG_0036-101-520x347.jpg'],
                inStock:true,
                deliver:true,
                mainImage: '',
                minBid:0
            },
            {
                id: "000004",
                title: 'Klassisk vinylsamling',
                description: 'En omfattende samling av klassiske vinylplater fra forskjellige sjangere og epoker, inkludert klassisk musikk, jazz, rock og pop. Samlingen inneholder sjeldne og ettertraktede utgivelser fra kjente artister og band. Perfekt for vinylentusiaster og musikkelskere som setter pris på den varme og autentiske lyden av vinyl.',
                price: 3000,
                originalPrice: 3000,
                category:['Musikk','Vinyl'],
                auction:false,
                deadline:'',
                images:['https://images.lauritz.com/images/BCA3EF612A3B993C2D51F822302F65D7','https://img.tradera.net/images/221/338990221_dd7450c9-1bde-46a4-899e-41f7c9cb5976.jpg','https://3.bp.blogspot.com/-D7kaQF8L90I/Vj00IVd_R5I/AAAAAAAAORk/YqYztnJQyvE/s1600/DSC04545_edited.jpg'],
                inStock:true,
                deliver:true,
                mainImage: '',
                minBid:0
            },
            {
                id: "000005",
                title: 'Vintage skinnjakke',
                description: 'En autentisk vintage skinnjakke i klassisk stil. Laget av høykvalitets skinn med en myk og behagelig følelse. Jakken har et tidløst design med detaljer som glidelåser, knapper og lommer. Perfekt for de som elsker den vintage stilen og ønsker å legge til en kult og edgy touch til antrekket sitt.',
                price: 2500,
                originalPrice: 2500,
                category:['Klær','Vintage'],
                auction:false,
                deadline:'',
                images:['https://www.rockdenim.no/pub_images/original/outdoor-5087.jpg?extend=copy&width=1024&method=fit&height=1024&type=webp&timestamp=1650882485','https://www.herremote.com/bilde/952030e895cda22e/american-soft-air-force-pilot-skinnjakke-665.jpg_.webp','https://www.herremote.com/bilde/952030e895cda22e/american-soft-air-force-pilot-skinnjakke-665_cm03.jpg_.webp'],
                inStock:true,
                deliver:true,
                mainImage: '',
                minBid:0
            },
            {
                id: "000006",
                title: 'Moderne kunstverk',
                description: 'Et unikt og abstrakt moderne kunstverk laget av anerkjent kunstner. Bildet har en blanding av farger, teksturer og former som skaper en visuell og følelsesmessig opplevelse. Et statement-stykke som vil være et imponerende tillegg til ethvert hjem, kontor eller galleri.',
                price: 12000,
                originalPrice: 12000,
                category:['Kunst','Moderne'],
                auction:false,
                deadline:'',
                images:['http://alexbrgst.de/2013/EXPRESSION-Moderne-Kunst-Malerei-Original-Gemaelde-Abstrakt-Blau-Bilder-Acrylbild.jpg'],
                inStock:true,
                deliver:true,
                mainImage: '',
                minBid:0
            },
            {
                id: "000007",
                title: 'Klassisk gitar',
                description: 'En vakker klassisk gitar med en rik og varm tone. Laget av kvalitetsmaterialer og håndverk, og har en imponerende klang og resonans. Perfekt for musikkelskere, nybegynnere eller erfarne gitarister som ønsker en kvalitetsgitar for opptredener, opplæring eller avslappet spilling hjemme.',
                price: 5000,
                originalPrice:5000,
                category:['Musikkinstrumenter','Gitar'],
                auction:true,
                deadline:'2023-06-15T14:30',
                images:['https://d1aeri3ty3izns.cloudfront.net/media/39/394925/1200/preview.jpg','https://www.musikk-miljo.no/images/thumbs/0112087_gitar-klassisk-morgan-cg-11-matt.jpeg','https://assets.catawiki.com/image/cw_normal/plain/assets/catawiki/assets/2015/2/16/0/4/3/0431d3ce-b5c8-11e4-8590-5a5f2f746281.jpg','https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.jdII290h5H2C2EseRxJKcQHaK7%26pid%3DApi&f=1&ipt=23ba3eaa765641c81407407dcb3b1aa0f0b3b16496ddcb232bdf4924737421f7&ipo=images'],
                inStock:true,
                deliver:true,
                mainImage: '',
                minBid:300
            },
            {
                id: "000008",
                title: 'Retro sykkel',
                description: 'En sjarmerende retro sykkel i vintage stil. Laget med en stålramme og klassisk design, og har detaljer som kurv, bagasjebrett, skjermer og en bekvemmelig sykkelstøtte. Perfekt for de som ønsker en unik og stilfull sykkel for avslappende turer i byen eller på landet.',
                price: 3500,
                originalPrice:3500,
                category:['Sykler','Vintage'],
                auction:false,
                deadline:'',
                images:['https://i.pinimg.com/originals/00/ca/d6/00cad6fe33b271fe5b3805ede7d8d4d3.jpg'],
                inStock:true,
                deliver:true,
                mainImage: '',
                minBid:0
            }
                 
        ],
        priceRange: {
            min: 0,
            max: 999999,
        },
    }
}