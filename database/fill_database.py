from database.schema import Category, SubCategory, Product, ProductContains, Tag
from database.engine import Database
from api.models.category import CategoryRead, SubCategoryRead
from api.models.product import ProductRead, ProductContainsRead
from api.models.tag import TagRead
from datetime import datetime, timedelta

categories = [
    {
        'name': 'Алкоголь',
        'id': 1,
        'image_path': '/static/alkogol.png',
        'searches': [
            {
                'name': 'Вина и крепкие напитки',
                'id': 0,
                'sub_category_id': 0
            }

        ],
        'sub_categories': [
            {
                "id": 0,
                "name": "Красные вина",
                "image_path": "/static/vino.png",
                "category_id": 0,
                "products": [
                    {
                        "id": 1,
                        "name": "Вино Pirovano Collezione Primitivo Puglia красное полусухое 13%",
                        "price": 799.98,
                        "amount": 750,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            },
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Красное полусухое вино с насыщенным вкусом и ароматом.",
                        "image_path": "/static/vino.png",
                        "compound": "Виноградный сок, сахар, регуляторы кислотности",
                        "expiration": "12 месяцев",
                        "storage": "При температуре от 0°C до +35°C",
                        "manufacturer": "ООО Вино, Россия",
                        "previous_price": 899.98
                    },
                    {
                        "id": 2,
                        "name": "Вино Kurni Marche красное сухое 14%",
                        "price": 1299.50,
                        "amount": 750,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Сухое вино из солнечных виноградников Италии.",
                        "image_path": "/static/vino1.png",
                        "compound": "Виноградный сок, натуральные дрожжи",
                        "expiration": "24 месяца",
                        "storage": "При температуре от +5°C до +20°C",
                        "manufacturer": "Kurni, Италия",
                        "previous_price": 1399.50
                    },
                    {
                        "id": 3,
                        "name": "Вино Torres Sangre de Toro красное сухое 13.5%",
                        "price": 1099.99,
                        "amount": 750,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Сухое испанское вино с глубоким фруктовым вкусом.",
                        "image_path": "/static/vino2.png",
                        "compound": "Виноградный сок, сахар",
                        "expiration": "18 месяцев",
                        "storage": "При температуре от 0°C до +25°C",
                        "manufacturer": "Torres, Испания",
                        "previous_price": 1199.99
                    },
                    {
                        "id": 4,
                        "name": "Вино Masi Costasera Amarone Classico красное сухое 15%",
                        "price": 2499.99,
                        "amount": 750,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Итальянское сухое вино с насыщенным вкусом и бархатным послевкусием.",
                        "image_path": "/static/vino3.png",
                        "compound": "Виноградный сок, натуральные дрожжи",
                        "expiration": "36 месяцев",
                        "storage": "При температуре от +5°C до +20°C",
                        "manufacturer": "Masi, Италия",
                        "previous_price": 2699.99
                    },
                    {
                        "id": 5,
                        "name": "Вино Antinori Tignanello красное сухое 13.5%",
                        "price": 3999.99,
                        "amount": 750,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Элитное сухое итальянское вино с богатым ароматом.",
                        "image_path": "/static/vino4.png",
                        "compound": "Виноградный сок, натуральные дрожжи",
                        "expiration": "48 месяцев",
                        "storage": "Хранить в прохладном месте",
                        "manufacturer": "Antinori, Италия",
                        "previous_price": 4299.99
                    }
                ]
            },
            {
                'name': 'Шампанское',
                'id': 100,
                'image_path': '/static/champagne.png',
                'products': [
                    {
                        'id': 1,
                        'name': 'Шампанское Moët & Chandon Brut Imperial белое сухое 12%',
                        'price': 3499.99,
                        'amount': 750,
                        'unit_of_masure': 'мл',
                        'tags': [],
                        'is_available': True,
                        'description': 'Классическое шампанское с элегантным вкусом и долгим послевкусием.',
                        'image_path': '/static/champagne1.png',
                        'category_id': 1,
                        'sub_category_id': 1,
                        'available_amount': 10,
                        'contains': [
                            {
                                'name': 'ккал',
                                'amount': '76'
                            },
                            {
                                'name': 'углеводы',
                                'amount': '2.5 гр'
                            }
                        ],
                        'compound': 'Виноградный сок, натуральные дрожжи',
                        'expiration': '36 месяцев',
                        'storage': 'Хранить в темном прохладном месте',
                        'manufacturer': 'Moët & Chandon, Франция'
                    },
                    {
                        'id': 2,
                        'name': 'Шампанское Veuve Clicquot Brut желтое сухое 12%',
                        'price': 3899.50,
                        'amount': 750,
                        'unit_of_masure': 'мл',
                        'tags': [
                            {
                                'name': 'Популярное',
                                'first_color': '#EEEFF3',
                                'second_color': '#1B1C1F'
                            }
                        ],
                        'is_available': True,
                        'description': 'Шампанское с фруктовым ароматом и насыщенным вкусом.',
                        'image_path': '/static/champagne2.png',
                        'category_id': 1,
                        'sub_category_id': 1,
                        'available_amount': 7,
                        'contains': [{'name': 'ккал', 'amount': '78'}, {'name': 'углеводы', 'amount': '2.3 гр'}],
                        'compound': 'Виноградный сок, сахар, натуральные дрожжи',
                        'expiration': '48 месяцев',
                        'storage': 'При температуре от +5°C до +20°C',
                        'manufacturer': 'Veuve Clicquot, Франция'
                    },
                    {
                        'id': 3,
                        'name': 'Шампанское Dom Pérignon Vintage 2012 белое сухое 12.5%',
                        'price': 18999.99,
                        'amount': 750,
                        'unit_of_masure': 'мл',
                        'tags': [],
                        'is_available': True,
                        'description': 'Элитное шампанское с утонченным ароматом и насыщенным вкусом.',
                        'image_path': '/static/champagne3.png',
                        'category_id': 1,
                        'sub_category_id': 1,
                        'available_amount': 3,
                        'contains': [{'name': 'ккал', 'amount': '80'}, {'name': 'углеводы', 'amount': '2.4 гр'}],
                        'compound': 'Виноградный сок, сахар, натуральные дрожжи',
                        'expiration': '60 месяцев',
                        'storage': 'Хранить в темном прохладном месте',
                        'manufacturer': 'Dom Pérignon, Франция'
                    },
                    {
                        'id': 4,
                        'name': 'Шампанское Taittinger Brut Reserve белое сухое 12%',
                        'price': 3299.99,
                        'amount': 750,
                        'unit_of_masure': 'мл',
                        'tags': [],
                        'is_available': True,
                        'description': 'Сухое шампанское с легким фруктовым послевкусием.',
                        'image_path': '/static/champagne4.png',
                        'category_id': 1,
                        'sub_category_id': 1,
                        'available_amount': 12,
                        'contains': [{'name': 'ккал', 'amount': '74'}, {'name': 'углеводы', 'amount': '2.2 гр'}],
                        'compound': 'Виноградный сок, натуральные дрожжи',
                        'expiration': '24 месяца',
                        'storage': 'Хранить в прохладном месте',
                        'manufacturer': 'Taittinger, Франция'
                    },
                    {
                        'id': 5,
                        'name': 'Шампанское Piper-Heidsieck Brut белое сухое 12%',
                        'price': 3199.99,
                        'amount': 750,
                        'unit_of_masure': 'мл',
                        'tags': [],
                        'is_available': True,
                        'description': 'Известное шампанское с бодрящим вкусом и ароматом цитрусовых.',
                        'image_path': '/static/champagne5.png',
                        'category_id': 1,
                        'sub_category_id': 1,
                        'available_amount': 8,
                        'contains': [{'name': 'ккал', 'amount': '77'}, {'name': 'углеводы', 'amount': '2.3 гр'}],
                        'compound': 'Виноградный сок, натуральные дрожжи',
                        'expiration': '48 месяцев',
                        'storage': 'При температуре от 0°C до +25°C',
                        'manufacturer': 'Piper-Heidsieck, Франция'
                    }
                ]
            },
            {
                "name": "Игристые вина",
                "id": 1,
                "image_path": "/static/igristyjeVina.png",
                "products": [
                    {
                        "id": 3,
                        "name": "Вино игристое Alta Terra Prosecco DOCG белое сухое 11%",
                        "price": 1199.99,
                        "amount": 750,
                        "unit_of_masure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Alta Terra Prosecco DOCG, с ярким ароматом цветов и фруктов.",
                        "image_path": "/static/alta_terra_prosecco.png",
                        "category_id": 1,
                        "sub_category_id": 1,
                        "available_amount": 15,
                        "compound": "Виноградный сок, сахар, натуральные дрожжи",
                        "expiration": "48 месяцев",
                        "storage": "Хранить в темном прохладном месте",
                        "manufacturer": "Alta Terra, Испания"
                    },
                    {
                        "id": 4,
                        "name": "Вино игристое Villa del Lago Brut белое брют 12%",
                        "price": 1499.99,
                        "amount": 750,
                        "unit_of_masure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Сухое игристое вино с нотами яблок и цитрусовых.",
                        "image_path": "/static/villa_del_lago.png",
                        "category_id": 1,
                        "sub_category_id": 1,
                        "available_amount": 15,
                        "compound": "Виноградный сок, натуральные дрожжи",
                        "expiration": "24 месяца",
                        "storage": "Хранить в прохладном месте",
                        "manufacturer": "Villa del Lago, Испания"
                    }
                ]
            },
            {
                "name": "Коньяк",
                "id": 2,
                "image_path": "/static/cognac.png",
                "products": [
                    {
                        "id": 6,
                        "name": "Коньяк Hennessy VS 3-летний 40%",
                        "price": 2399.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Благородный коньяк с фруктовыми и ореховыми нотками, выдержанный 3 года.",
                        "image_path": "/static/cognac1.png",
                        "category_id": 1,
                        "sub_category_id": 2,
                        "available_amount": 5,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "250"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Виноградный спирт, вода",
                        "expiration": "Бессрочно",
                        "storage": "Хранить в сухом и прохладном месте",
                        "manufacturer": "Hennessy, Франция"
                    },
                    {
                        "id": 7,
                        "name": "Коньяк Rémy Martin VSOP 4-летний 40%",
                        "price": 2999.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Коньяк с мягким и насыщенным вкусом, выдержанный 4 года.",
                        "image_path": "/static/cognac2.png",
                        "category_id": 1,
                        "sub_category_id": 2,
                        "available_amount": 8,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "252"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Виноградный спирт, вода",
                        "expiration": "Бессрочно",
                        "storage": "При температуре от +5°C до +25°C",
                        "manufacturer": "Rémy Martin, Франция"
                    },
                    {
                        "id": 8,
                        "name": "Коньяк Courvoisier VSOP 4-летний 40%",
                        "price": 3199.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "previous_price": 3499.99,
                        "is_available": True,
                        "description": "Коньяк с оттенками ванили и дуба, выдержанный в дубовых бочках.",
                        "image_path": "/static/cognac3.png",
                        "category_id": 1,
                        "sub_category_id": 2,
                        "available_amount": 10,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "248"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Виноградный спирт, вода",
                        "expiration": "Бессрочно",
                        "storage": "Хранить в темном прохладном месте",
                        "manufacturer": "Courvoisier, Франция"
                    },
                    {
                        "id": 9,
                        "name": "Коньяк Martell VS 3-летний 40%",
                        "price": 2099.99,
                        "amount": 500,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Мягкий коньяк с цветочными и фруктовыми ароматами.",
                        "image_path": "/static/cognac4.png",
                        "category_id": 1,
                        "sub_category_id": 2,
                        "available_amount": 15,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "249"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Виноградный спирт, вода",
                        "expiration": "Бессрочно",
                        "storage": "При температуре от +5°C до +25°C",
                        "manufacturer": "Martell, Франция"
                    },
                    {
                        "id": 10,
                        "name": "Коньяк Hine Rare VSOP 6-летний 40%",
                        "price": 4599.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Элегантный коньяк с богатым вкусом и ароматом специй и меда.",
                        "image_path": "/static/cognac5.png",
                        "category_id": 1,
                        "sub_category_id": 2,
                        "available_amount": 3,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "250"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Виноградный спирт, вода",
                        "expiration": "Бессрочно",
                        "storage": "Хранить в темном месте",
                        "manufacturer": "Hine, Франция"
                    }
                ]
            },
            {
                "name": "Ром",
                "id": 3,
                "image_path": "/static/rum.png",
                "products": [
                    {
                        "id": 11,
                        "name": "Ром Bacardi Carta Blanca 40%",
                        "price": 1299.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Классический белый ром с легкими нотами ванили и миндаля.",
                        "image_path": "/static/rum1.png",
                        "category_id": 1,
                        "sub_category_id": 3,
                        "available_amount": 20,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "220"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Сахарный тростник, вода",
                        "expiration": "Бессрочно",
                        "storage": "При температуре от +5°C до +25°C",
                        "manufacturer": "Bacardi, Багамы"
                    },
                    {
                        "id": 12,
                        "name": "Ром Captain Morgan Original Spiced Gold 35%",
                        "price": 1199.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "previous_price": 1399.99,
                        "is_available": True,
                        "description": "Ром с легкими пряными нотами и ароматом ванили.",
                        "image_path": "/static/rum2.png",
                        "category_id": 1,
                        "sub_category_id": 3,
                        "available_amount": 15,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "223"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Сахарный тростник, вода",
                        "expiration": "Бессрочно",
                        "storage": "Хранить в сухом месте",
                        "manufacturer": "Captain Morgan, Ямайка"
                    },
                    {
                        "id": 13,
                        "name": "Ром Havana Club Añejo 3 Años 40%",
                        "price": 999.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "is_available": True,
                        "description": "Ароматный ром с оттенками тропических фруктов, выдержанный 3 года.",
                        "image_path": "/static/rum3.png",
                        "category_id": 1,
                        "sub_category_id": 3,
                        "available_amount": 10,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "221"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Сахарный тростник, вода",
                        "expiration": "Бессрочно",
                        "storage": "Хранить в темном месте",
                        "manufacturer": "Havana Club, Куба"
                    },
                    {
                        "id": 14,
                        "name": "Ром Ron Barcelo Imperial 38%",
                        "price": 1699.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "is_available": True,
                        "description": "Выдержанный ром с насыщенным ароматом карамели и древесины.",
                        "image_path": "/static/rum4.png",
                        "category_id": 1,
                        "sub_category_id": 3,
                        "available_amount": 7,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "224"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Сахарный тростник, вода",
                        "expiration": "Бессрочно",
                        "storage": "Хранить в прохладном месте",
                        "manufacturer": "Ron Barcelo, Доминикана"
                    },
                    {
                        "id": 15,
                        "name": "Ром Plantation Barbados XO 20th Anniversary 40%",
                        "price": 2399.99,
                        "amount": 700,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#FFD700",
                                "second_color": "#000000"
                            }
                        ],
                        "is_available": True,
                        "description": "Благородный ром, выдержанный в бочках из-под бурбона и коньяка.",
                        "image_path": "/static/rum5.png",
                        "category_id": 1,
                        "sub_category_id": 3,
                        "available_amount": 4,
                        "contains": [
                            {
                                "name": "ккал",
                                "amount": "222"
                            },
                            {
                                "name": "углеводы",
                                "amount": "0 гр"
                            }
                        ],
                        "compound": "Сахарный тростник, вода",
                        "expiration": "Бессрочно",
                        "storage": "При температуре от +5°C до +25°C",
                        "manufacturer": "Plantation, Барбадос"
                    }
                ]
            }
        ]
    },
    {
        'name': 'Закуски',
        'id': 2,
        'image_path': '/static/zakuski.png'
    },
    {
        'name': 'Табак',
        'id': 3,
        'image_path': '/static/tabak.png'
    },
    {
        "name": "Аптека",
        "id": 0,
        "image_path": "/static/apteka.png",
        "sub_categories": [
            {
                "id": 0,
                "name": "Лекарственные препараты",
                "image_path": "/static/medicine.png",
                "category_id": 0,
                "products": [
                    {
                        "id": 0,
                        "name": "Парацетамол 500мг",
                        "price": 150,
                        "amount": 10,
                        "unit_of_measure": "таблетки",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Обезболивающее и жаропонижающее средство.",
                        "image_path": "/static/medicine1.png",
                        "compound": "Парацетамол",
                        "expiration": "24 месяца",
                        "storage": "При температуре не выше 25°C",
                        "manufacturer": "ООО Препарат, Россия",
                        "previous_price": 180
                    },
                    {
                        "id": 1,
                        "name": "Ибупрофен 200мг",
                        "price": 120,
                        "amount": 10,
                        "unit_of_measure": "таблетки",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Обезболивающее и противовоспалительное средство.",
                        "image_path": "/static/medicine2.png",
                        "compound": "Ибупрофен",
                        "expiration": "18 месяцев",
                        "storage": "При температуре не выше 25°C",
                        "manufacturer": "ООО Препарат, Россия",
                        "previous_price": 150
                    }
                ]
            },
            {
                "id": 1,
                "name": "Товары для здоровья",
                "image_path": "/static/health_products.png",
                "category_id": 0,
                "products": [
                    {
                        "id": 0,
                        "name": "Витамины для иммунитета",
                        "price": 300,
                        "amount": 30,
                        "unit_of_measure": "капсулы",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Комплекс витаминов для поддержания иммунной системы.",
                        "image_path": "/static/health1.png",
                        "compound": "Витамины C, D3, E, цинк",
                        "expiration": "12 месяцев",
                        "storage": "При температуре не выше 30°C",
                        "manufacturer": "ООО Здоровье, Россия",
                        "previous_price": 350
                    }
                ]
            },
            {
                "id": 2,
                "name": "Уход за кожей и волосами",
                "image_path": "/static/skin_hair.png",
                "category_id": 0,
                "products": [
                    {
                        "id": 0,
                        "name": "Крем для лица с SPF 50",
                        "price": 450,
                        "amount": 50,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Крем с высоким уровнем защиты от солнца.",
                        "image_path": "/static/skin1.png",
                        "compound": "УФ-фильтры, витамин E, алоэ вера",
                        "expiration": "18 месяцев",
                        "storage": "При температуре не выше 25°C",
                        "manufacturer": "ООО Красота, Россия",
                        "previous_price": 500
                    }
                ]
            },
            {
                "id": 3,
                "name": "Товары для детей",
                "image_path": "/static/kids_products.png",
                "category_id": 0,
                "products": [
                    {
                        "id": 0,
                        "name": "Детский сироп от кашля",
                        "price": 250,
                        "amount": 150,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 0,
                                "name": "Популярное",
                                "first_color": "#EEEFF3",
                                "second_color": "#1B1C1F"
                            }
                        ],
                        "is_available": True,
                        "description": "Сироп для лечения кашля у детей.",
                        "image_path": "/static/kids1.png",
                        "compound": "Экстракт липы, мёд, витамин C",
                        "expiration": "12 месяцев",
                        "storage": "При температуре не выше 25°C",
                        "manufacturer": "ООО Здоровье, Россия",
                        "previous_price": 300
                    }
                ]
            },
            {
                "id": 4,
                "name": "Средства личной гигиены",
                "image_path": "/static/hygiene.png",
                "category_id": 0,
                "products": [
                    {
                        "id": 0,
                        "name": "Шампунь для волос 250мл",
                        "price": 200,
                        "amount": 250,
                        "unit_of_measure": "мл",
                        "tags": [
                            {
                                "id": 1,
                                "name": "Акция",
                                "first_color": "#1B9F01",
                                "second_color": "#FFFFFF"
                            }
                        ],
                        "is_available": True,
                        "description": "Шампунь для ухода за волосами.",
                        "image_path": "/static/hygiene1.png",
                        "compound": "Экстракты трав, витамин B5",
                        "expiration": "12 месяцев",
                        "storage": "При температуре не выше 25°C",
                        "manufacturer": "ООО Красота, Россия",
                        "previous_price": 250
                    }
                ]
            }
        ]
    },
]


cities = ('Москва, Санкт-Петербург, Новосибирск, Екатеринбург, Казань, Нижний Новгород, Самара, '
          'Омск, Челябинск, Ростов-на-Дону, Уфа, Красноярск, Пермь, Воронеж, Волгоград, Краснодар, '
          'Саратов, Тюмень, Тольятти, Ижевск, Барнаул, Ульяновск, Иркутск, Хабаровск, Ярославль, '
          'Владивосток, Махачкала, Томск, Оренбург, Кемерово, Новокузнецк, Рязань, Астрахань, Пенза, '
          'Липецк, Тула, Калининград, Курск, Ставрополь, Улан-Удэ, Тверь, Магнитогорск, Иваново, '
          'Брянск, Белгород, Сочи, Сургут, Чита, Арзамас, Балашиха')

order_statuses = [
    {

        'name': 'Подтверждение',
        'full_status': 'Подтверждение заказа',
        'description': 'Ждем когда заказ подтвердят коллеги и мы начнем его собирать, это займет 5-15 минут'
    },
    {
        'name': 'В обработке',
        'full_status': 'Оформляем заказ',
        'description': 'Ваш заказ успешно подтвержден и начат процесс сборки'
    },
    {
        'name': 'Ожидаем курьера',
        'full_status': 'Ожидаем курьера',
        'description': 'Ваш заказ успешно собран и ожидает курьера'
    },
    {
        'name': 'В пути',
        'full_status': 'Ваш заказ в пути',
        'description': 'Будет у вас через'
    }
]

priorities = [
    {
        'name': 'Экспресс (20 - 45) минут',
        'priority': 0,
        'extra_cost': 30
    },
    {
        'name': 'Быстрая доставка (30 - 60) минут',
        'priority': '1',
        'extra_cost': 15
    },
    {
        'name': 'Обычная доставка (60 - 120 минут)',
        'priority': 2,
        'extra_cost': 0
    }
]

async def add_statuses() -> bool:
    db = Database()
    for status in order_statuses:
        await db.add_order_status(name=status.get('name'), full_status=status.get('full_status'),
                                  description=status.get('description'))
    return True

async def add_priorities() -> bool:
    db = Database()
    for priority in priorities:
        await db.add_order_priority(name=priority.get('name'), priority=priority.get('priority'), extra_cost=priority.get('extra_cost'))
    await db.add_user(phone_number='+71112223333', city_id=1)
    await db.add_code(phone_number='+71112223333', code='123123', expiration=timedelta(hours=48))



    return True
async def add_tax_delivery_cost() -> bool:
    db = Database()
    await db.add_tax(tax=13.0)
    await db.add_delivery_price(start_price=100.0, cost_per_100m=10.0)

async def fill_database() -> bool:
    db = Database()

    for category in categories:
        print(category.get('name'))
        category_ = await db.add_category(name=category.get('name'), image_path=category.get('image_path'))
        print('#' + category_.name + ' ' + str(category_.id))
        if category.get('searches'):
            for search in category.get('searches'):
                await db.add_search(name=search.get('name'), category_id=category_.id,
                                    sub_category_id=search.get('sub_category_id'))
        if category.get('sub_categories'):
            for sub_category in category.get('sub_categories'):
                print('~', sub_category.get('name'))
                sub_category_ = await db.add_sub_category(name=sub_category.get('name'),
                                                         category_id=category_.id,
                                                         image_path=sub_category.get('image_path'))
                print('# ', sub_category_.name + ' ' + str(sub_category_.id))
                print('#::', len(sub_category.get('products')), '^^ ', str(sub_category.get('products')))
                if sub_category.get('products'):
                    products = sub_category.get('products')[:]
                    for product in products:
                        print('~~', product.get('name'))
                        product_ = await db.add_product(
                            name=product.get('name'),
                            price=product.get('price'),
                            amount=product.get('amount'),
                            units_of_measure=product.get('unit_of_measure'),
                            is_available=product.get('is_available'),
                            description=product.get('description'),
                            image_path=product.get('image_path'),
                            sub_category_id=sub_category_.id,
                            compound=product.get('compound'),
                            expiration=product.get('expiration'),
                            storage=product.get('storage'),
                            manufacturer=product.get('manufacturer')
                        )
                        print('~#', product_.name + ' ' + str(product_.id))
                        if product.get('tags'):
                            for tag in product.get('tags'):
                                await db.add_tag(
                                    name=tag.get('name'),
                                    product_id=product_.id,
                                    first_color=tag.get('first_color'),
                                    second_color=tag.get('second_color')
                                )
                        if product.get('contains'):
                            for contain in product.get('contains'):
                                await db.add_product_contains(
                                    product_id=product_.id,
                                    name=contain.get('name'),
                                    amount=contain.get('amount')
                                )
                        del product_
    return True

async def fill_cities() -> bool:
    db = Database()
    for city in cities.split(','):
        await db.add_city(name=city, is_available=False)

    for city in range(1, 6):
        await db.update_city(id=city, is_available=True)

cities_data = [
    {
        'branches': [
            {
                'name': 'Москва Центр',
                'address': {
                    'street': 'Красная площадь',
                    'house': '1',
                    'floor': '1',
                    'flat': '1',
                    'entrance': '1',
                    'latitude': 55.753215,
                    'longitude': 37.622504
                },
                'products': [
                    {
                        'product_id': 12,
                        'amount': 10,
                    },
                    {
                        'product_id': 4,
                        'amount': 10,
                    },
                    {
                        'product_id': 8,
                        'amount': 5,
                    },
                    {
                        'product_id': 9,
                        'amount': 5,
                    },
                    {
                        'product_id': 5,
                        'amount': 3,
                    },
                ]
            },
            {
                'name': 'Москва Север',
                'address': {
                    'street': 'asdasda',
                    'house': '12',
                    'floor': '12',
                    'flat': '12',
                    'entrance': '12',
                    'latitude': 55.751215,
                    'longitude': 37.612504
                },
                'products': [
                    {
                        'product_id': 11,
                        'amount': 10,
                    },
                    {
                        'product_id': 10,
                        'amount': 10,
                    },
                    {
                        'product_id': 8,
                        'amount': 5,
                    },
                    {
                        'product_id': 2,
                        'amount': 5,
                    },
                    {
                        'product_id': 6,
                        'amount': 3,
                    },
                ]
            }
        ]
    }
]

async def add_branches():
    db = Database()
    city = cities_data[0]
    city_ = await db.add_city(name='Москва')
    if city.get('branches'):
        for branch in city.get('branches'):
            address = branch.get('address')
            address_ = await db.add_branch_address(
                city_id=city_.id,
                street=address.get('street'),
                house=address.get('house'),
                floor=address.get('floor'),
                flat=address.get('flat'),
                entrance=address.get('entrance'),
                latitude=address.get('latitude'),
                longitude=address.get('longitude'),
            )
            branch_ = await db.add_branch(
                name=branch.get('name'),
                address_id=address_.id,
                city_id=city_.id
            )
            if branch.get('products'):
                for product in branch.get('products'):
                    await db.add_branch_product(
                        product_id=product.get('product_id'),
                        branch_id=branch_.id,
                        amount=product.get('amount')
                    )
