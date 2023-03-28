const model = {
    app:{
        currentView:'frontPage',
        loggedInStatus: false,
        loggedInAs: '',
        wrongUserNamePasswordMessage: '',
        loggedInUser: {
            userName: '',
            userId: '',
        },
        userId:false,
        zoomedPic:false,
        userId: false,
        },

        inputs:{
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
                cvc: ''
                              
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
                    max:"",
                    min:0
                },
                filterAuctionCheck:true,
                filterNormalCheck:true,
                categoryList:[
                    {id:0,name:"Møbler",parent:-1,checked:false},
                    {id:1,name:"Bord",parent:0,checked:false},
                    {id:2,name:"Klær",parent:-1,checked:false},
                    {id:3,name:"Hatter",parent:2,checked:false},
                    {id:4,name:"Bukser",parent:2,checked:false}
                ]     
            },

            createSale: {
                id:'',
                title:'',
                description:'',
                price:'',
                category:'',
                auction:true,
                deadline:'22/02/2023',
                images:['',''],
                deliver:false   
            },
            search:{
                input:'',
                
            },
            product:{
                bidIncrease:""
            }
        },

    data:{
        users:{
            "0000001":{
                username:"admin",
                password:"admin",
                permissions:"admin",
                firstName:"Elin",
                surname:"Herlev Christoffersen",
                address:"GeTOutOfMyVei",
                email:"example@gmail.com",
                mobile:'00000000',    
            },
            "0000002":{
                username:"ikkeadmin",
                password:"ikkeadmin",
                permissions:"user",
                firstName:"Marie",
                surname:"benji",
                address:"GeTOutOfMyVei",
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
                itemId:'000001',
                sold: true,
                price:'10,000,000',
                date:'03.01.2023',
                type: 'direkte',
                userId: '00000001'
                
                
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
                category:['Små ting','Tilbehør'],
                auction:false,
                deadline:'2024-03-21T18:21',
                images:['assets/kronebilde1.png','assets/kronebilde2.png'],
                inStock:true,
                deliver:true
            },
            {
                id: "000002",
                title: 'auction prime time',
                description: 'ipsum lorem',
                price: 5000,
                category:['Møbler','Stoler'],
                auction:true,
                deadline:'2024-03-21T18:21',
                images:['assets/kronebilde1.png','assets/kronebilde2.png'],
                inStock:true,
                deliver:false
            },
        ],
        itemsCategory: [

            {
                title : 'Møbler',
                checked: false,
                subCategory: [
                    {title: 'Bord', checked: false},
                    {title: 'Stoler', checked: false},
                ]
            },
            {
                title : 'Små ting',
                checked: false,
                subCategory: [
                    {title: 'Vaser', checked: false},
                    {title: 'Lamper', checked: false},
                    {title: 'Tilbehør', checked: false},
                ]
            },
            {
                title : 'Klær og tilbehør',
                checked: false,
                subCategory: [
                    {title: 'Bukser', checked: false},
                    {title: 'Jakker', checked: false},
                ]
            },
        
        
        ],
        priceRange: {
            min: 0,
            max: 999999,
        },
    }
}