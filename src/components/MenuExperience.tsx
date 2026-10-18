import { categories, dishes } from '../data/menu'
import { usePreferences } from '../preferences/context'
import { useCopy } from '../i18n/useCopy'
import { MenuExperienceView } from './menu/MenuExperienceView'
import { menuViewCopy } from './menu/copy'
const demoDishes = dishes.map((dish) => ({
  ...dish,
  thumbnail: dish.image.replace('.webp', '-small.webp'),
  srcSet: dish.image.replace('.webp', '-small.webp') + ' 480w, ' + dish.image + ' 960w',
}))
export function MenuExperience({ preview = false }: { preview?: boolean }) {
  const { language, setLanguage, theme } = usePreferences()
  const { menu } = useCopy()
  return (
    <MenuExperienceView
      preview={preview}
      language={language}
      setLanguage={setLanguage}
      mode={theme}
      dishes={demoDishes}
      categories={categories.filter((category) => category.id !== 'all')}
      featuredIds={dishes.slice(0, 3).map((dish) => dish.id)}
      restaurantName={menu.restaurant}
      tagline={menu.tagline}
      text={menuViewCopy[language]}
      sampleNote={menu.demo + ' · ' + menu.sampleNote}
    />
  )
}
