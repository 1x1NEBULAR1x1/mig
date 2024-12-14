import classes from "../Classes.module.css";
import {useBranchesStore} from "../stores/useBranchesStore.ts";
import {deleteBranchProduct, getBranchCatalog, updateBranchProduct} from "../requests/branches.ts";


const BranchProduct = () => {

  const branchesStore = useBranchesStore(state => state)

  const updateProduct = async () => {
    if (!branchesStore.branchProduct) return
    const product = await updateBranchProduct(branchesStore.branchProduct)
    const categories = await getBranchCatalog(branchesStore.branch!.id)
    branchesStore.setProductsList(categories)
    branchesStore.setBranchProduct(product)
    branchesStore.setIsActionSuccess(true)
  }

  const deleteProduct = async () => {
    if (!branchesStore.branchProduct) return
    await deleteBranchProduct(branchesStore.branchProduct.id)
    const categories = await getBranchCatalog(branchesStore.branch!.id)
    branchesStore.setProductsList(categories)
    branchesStore.setBranchProduct(undefined)
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>Выбранный продукт</div>
      <div className={classes.menuContainer}>
        <div className={classes.name}>
          {branchesStore.branchProduct?.product.name}
        </div>
        <div className={classes.name} style={{display: 'flex', alignItems: 'center'}}>
          Доступен:
          <input
            style={{width: 'auto'}}
            type="checkbox"
            checked={branchesStore.branchProduct?.isAvailable}
            onChange={(e) => branchesStore.setBranchProduct({...branchesStore.branchProduct!, isAvailable: e.target.checked})}
          />
        </div>
        <div className={classes.name}>
          Количество:<br/>
          <input
            type="number"
            value={branchesStore.branchProduct?.amount}
            onChange={(e) => branchesStore.setBranchProduct({...branchesStore.branchProduct!, amount: parseInt(e.currentTarget.value)})}
          />
        </div>
        <div
          className={classes.button}
          style={{background: '#1b9f01', color: '#FFFFFF'}}
          onClick={async () => await updateProduct()}
        >
          Применить изменения
        </div>
        <div
          className={classes.button}
          style={{background: '#56585F', color: '#EEEFF9'}}
          onClick={async () => await deleteProduct()}
        >
          Удалить
        </div>
        {branchesStore.isActionSuccess && <div className={classes.success}>Изменения применены</div>}
      </div>

    </div>
  );
};

export default BranchProduct