import router from '@/router'
import getPageTitle from '@/utils/get-page-title' // Get page title


router.beforeEach(async(to, from, next) => {
 
  document.title = getPageTitle(to.meta.title)

})


