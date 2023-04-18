const model = {
    app:{
        currentView:'adminMembersPage',
        loggedInStatus: false,
        wrongUserNamePasswordMessage: '',
        userId:false,
        zoomedPic:false,
        currentProduct:false,
        frontPageCurrentShowing:{
            top:0,
            bottom:0,
        },
    },
        inputs:{
            adminMembersPage:{
                selectedUsersId: false,
                messageToUser: '',
            },
            shoppingCart: {
                items: {
                    canBuyNow: [
                        {id: "000001"},
                        {id: "000002"},
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
            category:{
                filteredItems:[],
                priceRange:{
                    max:0,
                    min:0
                },
                filterAuctionCheck:true,
                filterNormalCheck:true,
                categoryList:[
                    {id:0,name:"Møbler",parent:-1,checked:false},
                    {id:1,name:"Bord",parent:0,checked:false},
                    {id:2,name:"Klær",parent:-1,checked:false},
                    {id:3,name:"Hatter",parent:2,checked:false},
                    {id:4,name:'Småting',parent:-1,checked:false},
                    {id:5,name:'Tilbehør',parent:4,checked:false},
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
                adminBidIncrease:"",
                adminPriceChange:"",
                adminAddSubCategory:"",
                adminChangeMainCategory:""
            }
        },
    data:{
        frontPageTop:[0],
        frontPageBottom:[1],
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
                username:"ikkeadmin",
                password:"ikkeadmin",
                permissions:"user",
                firstName:"Marie",
                surName:"benji",
                address:"GeTOutOfMyVei",
                city:"Larvik",
                zip:"1482",
                email: 'example@gmail.com',
                mobile: '00000000',
                shoppingCart:[
                        {
                            item:"000001",
                            quantity:1
                        },
                    ],
            
                paymentInformation:[
                    {
                        cardNumber: "133780082420",
                        expirationDate:"12/12/2025",
                        cardHolderFirstName:"Nonja",
                        cardHolderLastName:"Buisness",
                        address:"Grove Street",
                        houseNumber:"69",
                        zip:"6969",
                        cvc:"123",
                        city: "Los Santos"
                    },
                ],
                messages:[
                    {
                        type:'user',
                        message: 'hei, jeg er marie!',
                    },
                    {
                        type:'admin',
                        message: 'hei, jeg er marie!',
                    }, 
                ]         
            }
        },
        orderHistory: [
            {

                itemId:000003,
                paid: true,
                price:'10,000,000',
                date:'03.01.2023',
                type: 'direkte',
                userId: '0000002',
                image : 'assets/kronebilde1.jpg',
                title: 'Krona Til Drøning'
            },
            {
                itemId:000002,
                paid: true,
                price:'10,000,000',
                date:'03.01.2023',
                type: 'direkte',
                userId: '0000002',
                image : 'assets/kronebilde1.jpg',
                title: 'Maling til Peter'
            },
        ],
        auctionListe: [
            {
                itemId: '000002',
                bids: {
                        '0000002': {bid: [1000, 20000], deleted: false},
                        '0000001': {bid: [1000, 10000], deleted: false}
                    },
            },
        ],

        items:[
            {
                id: "000001",
                title: 'Krone til dronningen av England',
                description: 'ipsum lorem',
                price: 70000,
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
                title: 'auction prime time',
                description: 'ipsum lorem',
                price: 5000,
                category:['Møbler','Stoler'],
                auction:true,
                deadline:'2024-03-21T18:21',
                images:['assets/kronebilde1.jpg','assets/kronebilde2.jpg'],
                inStock:true,
                deliver:false,
                minBid:0
            },
        ],
        priceRange: {
            min: 0,
            max: 999999,
        },
    }
}