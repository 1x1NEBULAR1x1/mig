import classes from "../Classes.module.css"
import {useProductsStore} from "../stores/useProductsStore";
import {useState, useEffect} from "react";
import {checkImage, getCategories} from "../requests/categories.ts";
import {url} from "../requests/url.ts";
import {
  updateProduct,
  deleteContains,
  updateContains,
  addContains,
  updateTag, addTag, deleteTag
} from "../requests/products.ts";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {
  ProductContainsCreate,
  ProductContainsUpdate,
  ProductRead,
  ProductTagCreate,
  ProductTagUpdate
} from "../models.ts";

const ProductUpdate = () => {

  const productsStore = useProductsStore(state => state)

  const categoriesStore = useCategoriesStore(state => state)

  const [price, setPrice] = useState(`${productsStore.product?.price}`)

  const [previousPrice, setPreviousPrice] = useState(productsStore.product?.previousPrice?.toString())

  const [file, setFile] = useState<File | undefined>(undefined)

  const [image, setImage] = useState<string>(url + productsStore.product!.imagePath)

  const onUploadImage = async (file: File) => {
    try{
      const check: string = await checkImage(file.name, url + '/static')
      if (check !== '') {
        productsStore.setImageError(true)
        setImage(url + '/static/' + check)
        productsStore.setProduct({...productsStore.product!, imagePath: url + "/static/" + check})
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

  const onDeleteContains = async (id: number) => {
    const product = await deleteContains(id)
    await updateState(product)
  }

  const onUpdateContains = async (contains: ProductContainsUpdate) => {
    const product = await updateContains(contains)
    await updateState(product)
  }

  const onCreateContains = async (contains: ProductContainsCreate) => {
    const product = await addContains(contains)
    await updateState(product)
    productsStore.setProductContainsAdd(undefined)
  }

  const onCreateTag = async (tag: ProductTagCreate) => {
    const product = await addTag(tag)
    await updateState(product)
    productsStore.setProductTagAdd(undefined)
  }

  const onUpdateTag = async (tag: ProductTagUpdate) => {
    const product = await updateTag(tag)
    await updateState(product)
  }

  const onDeleteTag = async (id: number) => {
    const product = await deleteTag(id)
    await updateState(product)
  }

  useEffect(() => {
    if (!file) return
    onUploadImage(file).then()
  }, [file]);

  useEffect(() => {
    setImage(url + productsStore.product!.imagePath)
    setPrice(`${productsStore.product!.price}`)
    setPreviousPrice(`${productsStore.product!.previousPrice}`)
    setFile(undefined)
  }, [productsStore.product?.id]);

  const getPrice = (value: string): string => {
    if (value.slice(-1) === '.') return value
    return (parseFloat(value) || '').toString()
  }

  const onUpdateProduct = async () => {
    let product = productsStore.product!

    product = {
      ...product,
      price: parseFloat(price),
      previousPrice: previousPrice ? parseFloat(previousPrice) : undefined,
    }

    if (product) {
      const productOut = await updateProduct(product, file)
      await updateState(productOut)
      setFile(undefined)
      productsStore.setIsActionSuccess(true)
    } else {
      productsStore.setIsActionSuccess(false)
    }

  }

  const updateState = async (product: ProductRead) => {
    const categories = await getCategories()
    categoriesStore.setCategories(categories)
    const subCategoryId = categoriesStore.subCategory!.id
    categoriesStore.setCategory(categories.find(c => c.id === categoriesStore.category!.id))
    setTimeout(() => {
      categoriesStore.setSubCategory(categoriesStore.category!.subCategories.find(s => s.id === subCategoryId))
    }, 1)
    setTimeout(() => {
      productsStore.setProduct(product)
    }, 1)
  }

  return (
    <div className={classes.menu} style={{width: '25vw'}}>
      <div className={classes.menuTitle}>Редактирование продукта</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>ID: {productsStore.product?.id}</div>
        <div className={classes.name}>
          Название продукта<br/>
          <input
            value={productsStore.product?.name}
            onInput={(e) => productsStore.setProduct({...productsStore.product!, name: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Цена (в рублях)<br/>
          <input
            value={price}
            onInput={(e) => setPrice(getPrice(e.currentTarget.value.replace(",", ".")))}
          />
        </div>
        <div className={classes.name}>
          Прошлая цена<br/>
          <input
            value={previousPrice}
            onInput={(e) => setPreviousPrice(getPrice(e.currentTarget.value.replace(",", ".")))}
          />
        </div>
        <div className={classes.name}>
          Количество:<br/>
          <input
            value={productsStore.product?.amount}
            onInput={(e) => productsStore.setProduct({
              ...productsStore.product!,
              amount: parseFloat(getPrice(e.currentTarget.value))
            })}
          />
        </div>
        <div className={classes.name}>
          Мера:<br/>
          <input
            value={productsStore.product?.unitsOfMeasure}
            onInput={(e) => productsStore.setProduct({
              ...productsStore.product!,
              unitsOfMeasure: e.currentTarget.value
            })}
          />
        </div>
        <div className={classes.name}>
          Доступен:
          <input
            style={{width: 'auto', marginLeft: '5px'}}
            type="checkbox"
            checked={productsStore.product?.isAvailable}
            onChange={() => productsStore.setProduct({
              ...productsStore.product!,
              isAvailable: !productsStore.product?.isAvailable
            })}
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
            value={productsStore.product?.description}
            onInput={(e) => productsStore.setProduct({...productsStore.product!, description: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Состав<br/>
          <input
            value={productsStore.product?.compound}
            onInput={(e) => productsStore.setProduct({...productsStore.product!, compound: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Термин пригодности<br/>
          <input
            value={productsStore.product?.expiration}
            onInput={(e) => productsStore.setProduct({...productsStore.product!, expiration: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Производитель<br/>
          <input
            value={productsStore.product?.manufacturer}
            onInput={(e) => productsStore.setProduct({...productsStore.product!, manufacturer: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Составляющие на 100г<br/>
          {productsStore.product?.contains?.map((component) => (
            <div className={classes.name}>
              <hr className={classes.hr}/>
              <input
                style={{width: '25%'}}
                value={component.name}
                onInput={(e) => productsStore.setProduct({
                  ...productsStore.product!,
                  contains: productsStore.product!.contains.map((c) => c.id === component.id ? {
                    ...c,
                    name: e.currentTarget.value
                  } : c)
                })}
              />
              <input
                style={{width: '25%'}}
                value={component.amount}
                onInput={(e) => productsStore.setProduct({
                  ...productsStore.product!,
                  contains: productsStore.product!.contains.map((c) => c.id === component.id ? {
                    ...c,
                    amount: e.currentTarget.value
                  } : c)
                })}
              />
              <div
                className={classes.button}
                style={{width: 'auto', display: 'inline-block', marginLeft: '5px'}}
                onClick={async () => onUpdateContains(component)}
              >
                Изменить
              </div>
              <div
                className={classes.button}
                style={{width: 'auto', display: 'inline-block', marginLeft: '5px'}}
                onClick={async () => {
                  productsStore.setProduct({
                    ...productsStore.product!,
                    contains: productsStore.product!.contains.filter((c) => c.name !== component.name)
                  });
                  await onDeleteContains(component.id)
                }}
              >
                Удалить
              </div>
            </div>
          ))}
          {productsStore.productContainsAdd && <div className={classes.name}>
						<hr className={classes.hr}/>
						<input
							style={{width: '25%'}}
							value={productsStore.productContainsAdd?.name}
							onInput={(e) => productsStore.setProductContainsAdd({
                ...productsStore.productContainsAdd!,
                name: e.currentTarget.value
              })}
						/>
						<input
							style={{width: '25%'}}
							value={productsStore.productContainsAdd?.amount}
							onInput={(e) => productsStore.setProductContainsAdd({
                ...productsStore.productContainsAdd!,
                amount: e.currentTarget.value
              })}
						/>
						<div
							className={classes.button}
							style={{
                width: 'auto',
                display: 'inline-block',
                marginLeft: '5px',
                background: '#1b9f01',
                color: '#EEEFF9'
              }}
							onClick={async () => await onCreateContains(productsStore.productContainsAdd!)}
						>
							Добавить
						</div>
					</div>}
        </div>
        <div
          className={classes.button}
          style={productsStore.productContainsAdd ? {background: "#56585F", color: "#EEEFF9"} : {}}
          onClick={() => productsStore.setProductContainsAdd(!productsStore.productContainsAdd ? {
            name: '',
            amount: '',
            productId: productsStore.product!.id
          } : undefined)}
        >
          {!productsStore.productContainsAdd ? "Добавить составляющую продукта" : 'Выйти из режима создания'}
        </div>
        <div className={classes.name}>
          Тэги
          {productsStore.product?.tags?.map((tag) => (
            <div className={classes.name} key={`productTag#${tag.id}product#${productsStore.product?.id}`}>
              <hr className={classes.hr}/>
              <input
                style={{width: '100%'}}
                value={tag.name}
                placeholder={'название'}
                onInput={(e) => productsStore.setProduct({
                  ...productsStore.product!, tags: productsStore.product!.tags.map((t) =>
                    t.id === tag.id
                      ? { ...t, name: e.currentTarget.value }
                      : t),
                  })
                }
              /><br/>
              <input
                style={{width: '49%'}}
                type='color'
                value={tag.firstColor}
                onInput={(e) => productsStore.setProduct({
                    ...productsStore.product!,
                    tags: productsStore.product!.tags.map((t) =>
                      t.id === tag.id
                        ? { ...t, firstColor: e.currentTarget.value }
                        : t
                    ),
                  })
                }
              />
              <input
                style={{width: '49%', marginLeft: '2%'}}
                type='color'
                value={tag.secondColor}
                onInput={(e) => productsStore.setProduct({
                    ...productsStore.product!,
                    tags: productsStore.product!.tags.map((t) =>
                      t.id === tag.id
                        ? { ...t, secondColor: e.currentTarget.value }
                        : t
                    ),
                  })
                }
              /><br/>
              <div style={{display:'flex', gap: '2%', marginTop: '1vh'}}>
                <div
                  className={classes.button}
                  style={{display: 'block', width: '49%'}}
                  onClick={async () => onUpdateTag({name: tag.name, firstColor: tag.firstColor, secondColor: tag.secondColor, productId: productsStore.product!.id, id: tag.id})}
                >
                  Изменить
                </div>
                <div
                  className={classes.button}
                  style={{display: 'block', marginLeft: '5px', width: '49%'}}
                  onClick={async () => {
                    productsStore.setProduct({
                      ...productsStore.product!,
                      tags: productsStore.product!.tags.filter((t) => t.id !== tag.id)
                    });
                    await onDeleteTag(tag.id)
                  }}
                >
                  Удалить
                </div>
              </div>
            </div>
          ))}
          {productsStore.productTagAdd && <div className={classes.name}>
						<hr className={classes.hr}/>
						<input
							style={{width: '100%'}}
							value={productsStore.productTagAdd.name}
							onInput={(e) => productsStore.setProductTagAdd({
                ...productsStore.productTagAdd!,
                name: e.currentTarget.value
              })}
						/><br/>
						<input
							type='color'
              style={{width: '49%'}}
							value={productsStore.productTagAdd.firstColor}
							onInput={(e) => productsStore.setProductTagAdd({
                ...productsStore.productTagAdd!,
                firstColor: e.currentTarget.value
              })}
						/>
						<input
							type='color'
              style={{width: '49%', marginLeft: '2%'}}
							value={productsStore.productTagAdd.secondColor}
							onInput={(e) => productsStore.setProductTagAdd({
                ...productsStore.productTagAdd!,
                secondColor: e.currentTarget.value
              })}
						/><br/>
						<div
							className={classes.button}
							style={{
                width: '100%',
                marginTop: '1vh',
                display: 'block',
                background: '#1b9f01',
                color: '#EEEFF9',
                textAlign: 'center'
              }}
							onClick={async () => await onCreateTag(productsStore.productTagAdd!)}
						>
							Добавить
						</div>
					</div>}
        </div>
        <div
          className={classes.button}
          onClick={() => productsStore.setProductTagAdd(productsStore.productTagAdd ? undefined : {
            id: 0,
            productId: productsStore.product!.id,
            name: '',
            firstColor: '#000000',
            secondColor: '#FFFFFF'
          })}
          style={productsStore.productTagAdd ? {background: "#56585F", color: "#EEEFF9"} : {}}
        >
          {!productsStore.setProductTagAdd ? 'Добавть тэг' : "Выйти из режима создания"}
        </div>
        <div
          className={classes.button}
          onClick={async () => await onUpdateProduct()}
          style={{background: '#1b9f01', color: '#EEEFF9'}}
        >
          Применить изменения
        </div>
        {productsStore.isActionSuccess && <div className={classes.success}>Изменения успешно применены</div>}
      </div>
    </div>
  )
}


export default ProductUpdate