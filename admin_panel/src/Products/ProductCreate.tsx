import classes from '../Classes.module.css'
import {useEffect, useState} from "react";
import {useProductsStore} from "../stores/useProductsStore.ts";
import {url} from "../requests/url.ts";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {checkImage, getCategories} from "../requests/categories.ts";
import {addProduct} from "../requests/products.ts";



const ProductCreate = () => {

  const productsStore = useProductsStore(state => state)

  const categoriesStore = useCategoriesStore(state => state)

  const [price, setPrice] = useState(`${productsStore.productAdd?.price}`)

  const [previousPrice, setPreviousPrice] = useState(productsStore.productAdd?.previousPrice?.toString())

  const [amount, setAmount] = useState(`${productsStore.productAdd?.amount}`)

  const [file, setFile] = useState<File | undefined>(undefined)

  const [image, setImage] = useState<string>(url + productsStore.productAdd?.imagePath)

  const onUploadImage = async (file: File) => {
    try{
      const check: string = await checkImage(file.name, url + '/static')
      if (check !== '') {
        productsStore.setImageError(true)
        setImage(url + '/static/' + check)
        productsStore.setProductAdd({...productsStore.productAdd!, imagePath: url + "/static/" + check})
        return
      } else {
        productsStore.setImageError(false)
        setImage(URL.createObjectURL(file))
      }
    }
    catch {
      console.log()
    }
    setImage(URL.createObjectURL(file))
    productsStore.setImageError(false)
  }

  const getPrice = (value: string): string => {
    if (value.slice(-1) === '.') return value
    return (parseFloat(value) || '').toString()
  }

  useEffect(() => {
    if (!file) return
    onUploadImage(file).then()
  }, [file]);

  useEffect(() => {
    setImage(url + productsStore.productAdd!.imagePath)
    setPrice(`${productsStore.productAdd!.price}`)
    setPreviousPrice(`${productsStore.productAdd!.previousPrice}`)
    setFile(undefined)
  }, [productsStore.isProductAdd]);


  const onCreateProduct = async () => {
    const product = await addProduct({...productsStore.productAdd!, subCategoryId: categoriesStore.subCategory!.id}, file)
    productsStore.setIsActionSuccess(true)
    productsStore.setProductTagAdd(undefined)
    productsStore.setProductContainsAdd(undefined)
    productsStore.setIsProductAdd(-1)
    const categories = await getCategories()
    categoriesStore.setCategories(categories)
    const subCategoryId = categoriesStore.subCategory!.id
    const category = categories.find(c => c.id === categoriesStore.category!.id)
    const subCategory = category!.subCategories.find(s => s.id === subCategoryId)
    categoriesStore.setCategory(category)
    setTimeout(() => {
      categoriesStore.setSubCategory(subCategory)
      setTimeout(() => {
        productsStore.setProduct(product)
      }, 10)
    }, 10)

  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Создание продукта</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>
          Название продукта<br/>
          <input
            value={productsStore.productAdd?.name}
            onChange={e => productsStore.setProductAdd({...productsStore.productAdd!, name: e.target.value})}
          />
        </div>
        <div className={classes.name}>
          Цена<br/>
          <input
            value={price}
            onChange={e => {
              setPrice(getPrice(e.target.value))
              productsStore.setProductAdd({...productsStore.productAdd!, price: parseFloat(getPrice(e.target.value))})
            }}
          />
        </div>
        <div className={classes.name}>
          Предыдущая цена<br/>
          <input
            value={previousPrice}
            onChange={e => {
              setPreviousPrice(getPrice(e.target.value))
              productsStore.setProductAdd({
                ...productsStore.productAdd!,
                previousPrice: parseFloat(getPrice(e.target.value))
              })
            }}
          />
        </div>
        <div className={classes.name}>
          Количество<br/>
          <input
            value={amount}
            onChange={e => {
              setAmount(getPrice(e.target.value))
              productsStore.setProductAdd({...productsStore.productAdd!, amount: parseFloat(getPrice(e.target.value))})
            }}
          />
        </div>
        <div className={classes.name}>
          Доступен:
          <input
            style={{width: 'auto', marginLeft: '5px'}}
            type="checkbox"
            checked={productsStore.productAdd?.isAvailable}
            onChange={() => productsStore.setProductAdd({
              ...productsStore.productAdd!,
              isAvailable: !productsStore.productAdd?.isAvailable
            })}
          />
        </div>
        <div className={classes.name}>
          Единицы меры<br/>
          <input
            value={productsStore.productAdd?.unitsOfMeasure}
            onChange={e => productsStore.setProductAdd({...productsStore.productAdd!, unitsOfMeasure: e.target.value})}
          />
        </div>
        <div className={classes.name}>
          Изображение<br/>
          <div className={classes.nameImg}>
            <img
              src={image}
              alt={productsStore.product?.name}
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </div>
        </div>
        {productsStore.imageError && <div className={classes.name}>Файл с таким именем уже существует</div>}
        <div className={classes.name}>
          Описание<br/>
          <textarea
            value={productsStore.productAdd?.description}
            onChange={e => productsStore.setProductAdd({...productsStore.productAdd!, description: e.target.value})}
          />
        </div>
        <div className={classes.name}>
          Состав<br/>
          <textarea
            value={productsStore.productAdd?.compound}
            onChange={e => productsStore.setProductAdd({...productsStore.productAdd!, compound: e.target.value})}
          />
        </div>
        <div className={classes.name}>
          Термин пригодности<br/>
          <input
            value={productsStore.productAdd?.expiration}
            onChange={e => productsStore.setProductAdd({...productsStore.productAdd!, expiration: e.target.value})}
          />
        </div>
        <div className={classes.name}>
          Производитель<br/>
          <input
            value={productsStore.productAdd?.manufacturer}
            onChange={e => productsStore.setProductAdd({...productsStore.productAdd!, manufacturer: e.target.value})}
          />
        </div>
        <div className={classes.name} style={{width: '100%'}}>
          Составляющие на 100г<br/>
          {productsStore.productAdd?.contains?.map((component) => (
            <div className={classes.name}>
              <hr className={classes.hr}/>
              <input
                style={{width: '25%'}}
                value={component.name}
                onInput={(e) => productsStore.setProductAdd({
                  ...productsStore.productAdd!,
                  contains: productsStore.productAdd!.contains.map((c) => c.id === component.id ? {
                    ...c,
                    name: e.currentTarget.value
                  } : c)
                })}
              />
              <input
                style={{width: '25%'}}
                value={component.amount}
                onInput={(e) => productsStore.setProductAdd({
                  ...productsStore.productAdd!,
                  contains: productsStore.productAdd!.contains.map((c) => c.id === component.id ? {
                    ...c,
                    amount: e.currentTarget.value
                  } : c)
                })}
              />
              <div
                className={classes.button}
                style={{width: '20%', display: 'inline-block', marginLeft: '5px'}}
                onClick={async () => {
                  productsStore.setProductAdd({
                    ...productsStore.productAdd!,
                    contains: productsStore.productAdd!.contains.filter((c) => c.id !== component.id)
                  });
                }}
              >
                Удалить
              </div>
            </div>
          ))}
          <div
            className={classes.button}
            style={{
              width: 'auto',
              display: 'inline-block',
              background: '#1b9f01',
              color: '#EEEFF9'
          }}
            onClick={() => productsStore.setProductAdd({
              ...productsStore.productAdd!,
              contains: [
                ...productsStore.productAdd!.contains, {
                ...productsStore.productContainsAdd!,
                  id: (productsStore.productAdd!.contains.length + 1)}]
            })}
          >
            Добавить
          </div>
        </div>
        <div className={classes.name}>
          Тeги<br/>
          {productsStore.productAdd!.tags.map((tag) => (
            <div className={classes.name} key={`productTag#${tag.id}product#create}`}>
              <hr className={classes.hr}/>
              <input
                style={{width: '25%'}}
                value={tag.name}
                placeholder={'название'}
                onInput={(e) => productsStore.setProductAdd({
                  ...productsStore.productAdd!, tags: productsStore.productAdd!.tags.map((t) =>
                    t.id === tag.id
                      ? {...t, name: e.currentTarget.value}
                      : t),
                })
                }
              />
              <input
                style={{width: '25%'}}
                type='color'
                value={tag.firstColor}
                onInput={(e) => productsStore.setProductAdd({
                  ...productsStore.productAdd!,
                  tags: productsStore.productAdd!.tags.map((t) =>
                    t.id === tag.id
                      ? {...t, firstColor: e.currentTarget.value}
                      : t
                  ),
                })
                }
              />
              <input
                style={{width: '25%', marginLeft: '2%'}}
                type='color'
                value={tag.secondColor}
                onInput={(e) => productsStore.setProductAdd({
                  ...productsStore.productAdd!,
                  tags: productsStore.productAdd!.tags.map((t) =>
                    t.id === tag.id
                      ? {...t, secondColor: e.currentTarget.value}
                      : t
                  ),
                })
                }
              />
              <div
                className={classes.button}
                style={{display: 'inline-block', marginLeft: '5px', width: '20%'}}
                onClick={async () => {
                  productsStore.setProductAdd({
                    ...productsStore.productAdd!,
                    tags: productsStore.productAdd!.tags.filter((t) => t.id !== tag.id)
                  });
                }}
              >
                Удалить
              </div>
            </div>
          ))}
          <div
            className={classes.button}
            style={{
              width: '20%',
              marginTop: '1vh',
              display: 'inline-block',
              background: '#1b9f01',
              color: '#EEEFF9',
              textAlign: 'center'
          }}
            onClick={() => {productsStore.setProductAdd({
              ...productsStore.productAdd!,
              tags: [
                ...productsStore.productAdd!.tags, {
                name: '',
                  id: (productsStore.productAdd!.tags.length + 1),
                  firstColor: '#FFFFFF',
                  secondColor: '#000000',
                  productId: -1
              }
              ]
            })}}
          >
            Добавить
          </div>
        </div>
        <div
          className={classes.button}
          style={{color: 'white', background: '#1b9f01'}}
          onClick={async () => await onCreateProduct()}
        >
          Создать продукт
        </div>
      </div>
    </div>
  )
}


export default ProductCreate
