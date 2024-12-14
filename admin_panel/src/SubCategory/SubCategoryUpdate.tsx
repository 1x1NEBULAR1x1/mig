import classes from '../Classes.module.css'
import {useCategoriesStore} from "../stores/useCategoriesStore.ts";
import {getCategories, updateSubCategory, checkImage} from "../requests/categories.ts";
import {url} from "../requests/url.ts";
import {useEffect, useState} from "react";

const SubCategoryUpdate = () => {

  const categoriesStore = useCategoriesStore(state => state)


  const [host, setHost] = useState(url)

  const [file, setFile] = useState<File>()

  useEffect(() => {
    setHost(url)
  }, [categoriesStore.subCategory?.id]);

  const onUploadImage = async (file: File) => {
    setHost('')
    categoriesStore.setSubCategory({...categoriesStore.subCategory!, imagePath: URL.createObjectURL(file)})
    const check: string = await checkImage(file.name, host)
    if (check) {
      setHost(url)
      categoriesStore.setImageError(true)
      categoriesStore.setSubCategory({...categoriesStore.subCategory!, imagePath: url + check})
    } else {
      setFile(file)
      categoriesStore.setImageError(false)
    }
  }

  useEffect(() => {
    if (!file) return
    onUploadImage(file).then()
  }, [file]);

  const onApplyChanges = async () => {
    const category = await updateSubCategory(categoriesStore.subCategory!, file)
    if (category) {
      categoriesStore.setCategory(category)
      categoriesStore.setIsSubCategoryUpdateSuccess(true)
      const categories = await getCategories()
      categoriesStore.setCategories(categories)
    }
  }


  return (
    <div
      className={classes.menu}
    >
      <div className={classes.menuTitle}>Редактирование подкатегории</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>ID: {categoriesStore.subCategory?.id}</div>
        <div className={classes.name}>
          Название подкатегории
          <input
            className={classes.input}
            type="text"
            value={categoriesStore.subCategory?.name}
            onInput={(e) => categoriesStore.setSubCategory({...categoriesStore.subCategory!, name: e.currentTarget.value})}
          />
        </div>
        <div className={classes.name}>
          Изображение
          <div className={classes.nameImg}>
            <img
              src={host + categoriesStore.subCategory?.imagePath}
              alt={categoriesStore.subCategory?.name}
            />
            <input
              type="file"
              onInput={(e) => setFile(e.currentTarget.files![0])}
            />
          </div>
          {categoriesStore.imageError && <div>Файл с таким именем уже существует</div>}
        </div>
        <div
          className={classes.button}
          onClick={async () => await onApplyChanges()}
          style={{background: '#1b9f01', color: 'white'}}
        >
          Применить изменения
        </div>
        {categoriesStore.isSubCategoryUpdateSuccess && <div className={classes.success}>Подкатегория успешно обновлена</div>}
      </div>
    </div>
  )
}

export default SubCategoryUpdate