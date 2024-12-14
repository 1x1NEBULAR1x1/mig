import classes from '../Classes.module.css'
import {useBranchesStore} from "../stores/useBranchesStore.ts";
import {BranchCategory, BranchProduct, BranchSubCatgeory} from "../models.ts";
import {useEffect, useState} from "react";
import {addBranchProduct, getBranchCatalog, getBranchProduct} from "../requests/branches.ts";
import {getCategories} from "../requests/categories.ts";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";

const BranchProducts = () => {

  const [category, setCategory] = useState<BranchCategory | undefined>(undefined)

  const [subCategory, setSubCategory] = useState<BranchSubCatgeory | undefined>(undefined)

  const [product, setProduct] = useState<BranchProduct | undefined>(undefined)

  const branchesStore = useBranchesStore(state => state)

  const categoriesStore = useCategoriesStore(state => state)

  useEffect(() => {
    if (!branchesStore.branch?.id) return
    getBranchCatalog(branchesStore.branch!.id).then((categories) => {
      branchesStore.setProductsList(categories)
    })
    getCategories().then(categories => categoriesStore.setCategories(categories))
  }, [branchesStore.branch?.id]);

  const addCategory = () => {
    if (!category || !branchesStore.productsList) return
    branchesStore.setProductsList([...branchesStore.productsList, category])
    setCategory(undefined)
  }

  const addProduct = async () => {
    if (!product || !branchesStore.productsList) return
    await addBranchProduct(branchesStore.branch!.id, product)
    const categroies = await getBranchCatalog(branchesStore.branch!.id)
    branchesStore.setProductsList(categroies)
    setProduct(undefined)
  }

  const addSubCategory = (categoryId: number) => {
    if (!subCategory || !branchesStore.productsList) return
    const categroies = branchesStore.productsList.map(c => {
      if (c.id == categoryId) {
        return {...c, sub_categories: [...c.sub_categories, subCategory]}
      }
      return c
    })
    branchesStore.setProductsList(categroies)
    setSubCategory(undefined)
  }


  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Список категорий продуктов на складе</div>
      <div className={classes.menuContainer}>
        {branchesStore.productsList?.map((category) => (
          <div className={classes.name} style={{marginLeft: '2%'}}>
            Категория {category.name}
            <hr className={classes.hr}/>
            {category.sub_categories && category.sub_categories.map(
              (subCategory) => (
                <div className={classes.name}  style={{marginLeft: '2%'}}>
                  Подкатегория {subCategory.name}
                  <hr className={classes.hr}/>
                  {subCategory.branch_products && subCategory.branch_products.map(
                    (product) => (
                      <div className={classes.name}
                        style={product.id == branchesStore.branchProduct?.id
                          ? {color: '#1b9f01', width: 'auto', marginLeft: '2%'}
                          : {cursor: 'pointer', width: 'auto', marginLeft: '2%'}}
                        onClick={async () => {
                          const branchProduct = await getBranchProduct(product.id)
                          branchesStore.setBranchProduct(branchProduct)
                        }}
                      >
                        - {product.product.name.slice(0, 40)} - {product.amount} ({product.is_available ? 'доступен' : 'не доступен'})
                      </div>
                    )
                  )}
                  <div className={classes.name} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    & Добавить продукт
                    <select
                      style={{width: '15vw'}}
                      className={classes.select}
                      value={product?.product.name || ''}
                      onChange={(e) => {
                        const selectedProduct = categoriesStore.categories.find(c => c.id === category.id)?.subCategories?.find(s => s.name === subCategory.name)?.products?.find(p => p.name === e.currentTarget.value);
                        if (!selectedProduct) {
                          setProduct(undefined)
                          return;
                        }
                        const product = {
                          product: {
                            id: selectedProduct.id,
                            name: selectedProduct.name,
                            price: selectedProduct.price,
                            image_path: selectedProduct.imagePath
                          },
                          id: -1,
                          amount: 1,
                          is_available: false
                        }
                        setProduct(product)
                      }}
                    >
                      <option value="" disabled>Выберите продукт</option>
                      {categoriesStore.categories.find(c => c.id === category.id)?.subCategories?.find(c => c.name === subCategory.name)?.products?.map((product) => {
                        if (subCategory.branch_products?.find(c => c.product.id === product.id)) return
                        return <option key={product.id} value={product.name}>{product.name}</option>
                      })}
                    </select>
                    <div className={classes.button} style={{width: 'auto'}} onClick={async () => await addProduct()}>
                      Добавить
                    </div>
                  </div>
                </div>
              )
            )}
            <div className={classes.name} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              # Добавить подкатегорию
              <select
                className={classes.select}
                value={subCategory?.name || ''}
                onChange={(e) => {
                  const selectedCategory = categoriesStore.categories.find(c => c.id === category.id)?.subCategories?.find(c => c.name === e.currentTarget.value);
                  if (!selectedCategory) {
                    setSubCategory(undefined)
                    return;
                  }
                  setSubCategory({
                    name: selectedCategory.name,
                    id: selectedCategory.id,
                    branch_products: [],
                    image_path: selectedCategory.imagePath,
                    is_available: selectedCategory.isAvailable
                  });
                }}
              >
                <option value="" disabled>Выберите подкатегорию</option>
                {categoriesStore.categories?.find(c => c.id === category.id)?.subCategories?.map((subCategory) => {
                  if (category.sub_categories?.find(c => c.id === subCategory.id)) return
                  return <option key={subCategory.id} value={subCategory.name}>{subCategory.name}</option>
                })}
              </select>
              <div
                style={{width: 'auto'}}
                className={classes.button}
                onClick={() => addSubCategory(category.id)}
              >
                Добавить
              </div>
            </div>
          </div>
        ))}
        <div className={classes.name} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          ! Добавить категорию
          <select
            className={classes.select}
            value={category?.name || ''}
            onChange={(e) => {
              const selectedCategory = categoriesStore.categories.find(c => c.name === e.currentTarget.value);
              if (!selectedCategory) {
                setCategory(undefined);
                return;
              }
              setCategory({
                name: selectedCategory.name,
                id: selectedCategory.id,
                sub_categories: [],
                image_path: selectedCategory.imagePath
              });
            }}
          >
            <option value="" disabled>Выберите категорию</option>
            {categoriesStore.categories.map(category => {
              if (branchesStore.productsList?.find(c => c.id === category.id)) return;
              return (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              );
            })}
          </select>
          <div
            style={{width: 'auto'}}
            className={classes.button}
            onClick={() => addCategory()}
          >
            Добавить
          </div>
        </div>
      </div>
    </div>
  )
}

export default BranchProducts