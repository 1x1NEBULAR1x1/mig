import classes from "../Classes.module.css";
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {useEffect, useState} from "react";
import {url} from "../requests/url.ts";
import {checkImage, addSubCategory, getCategories} from "../requests/categories.ts";


const SubCategoryCreate = () => {

  const [file, setFile] = useState<File>()

  const [image, setImage] = useState<string>()

  const categoriesStore = useCategoriesStore(state => state)

  const onUploadImage = async (file: File) => {
    try{
      const check: string = await checkImage(file.name, url + '/static')
      if (check !== '') {
        categoriesStore.setImageError(true)
        setImage(url + '/static/' + check)
        categoriesStore.setSubCategoryAdd({...categoriesStore.subCategoryAdd!, imagePath: url + check})
        return
      }
    }
    catch {
      console.log()
    }
    setImage(URL.createObjectURL(file))
    categoriesStore.setImageError(false)
  }

  useEffect(() => {
    if (!file) return
    onUploadImage(file).then()
  }, [file]);

  const onApplyChanges = async () => {
    const category = await addSubCategory({...categoriesStore.subCategoryAdd!, categoryId: categoriesStore.category!.id}, file)
    if (category) {
      categoriesStore.setCategory(category)
      categoriesStore.setIsSubCategoryAddSuccess(true)
      const categories = await getCategories()
      categoriesStore.setCategories(categories)
    }
  }


  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}> Создание подкатегории </div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>ID категории: {categoriesStore.category!.id}</div>
        <div className={classes.name}>
          Название подкатегории
          <input
            className={classes.input}
            type="text"
            value={categoriesStore.subCategoryAdd?.name}
            onInput={(e) => categoriesStore.setSubCategoryAdd({...categoriesStore.subCategoryAdd!, name: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Изображение
          <div className={classes.nameImg}>
            <img
              src={image}
              alt={categoriesStore.subCategoryAdd?.name || ''}
            />
            <input
              type="file"
              onInput={(e) => setFile(e.currentTarget.files![0])}
            />
          </div>
        </div>
        {categoriesStore.imageError && <div className={classes.error}>Файл с таким именем уже существует</div>}
        <div
          className={classes.button}
          onClick={async () => onApplyChanges()}
        >
          Создать подкатегорию
        </div>
        {categoriesStore.isSubCategoryAddSuccess && <div className={classes.success}>Подкатегория создана</div>}
      </div>
    </div>
  )
}

export default SubCategoryCreate
