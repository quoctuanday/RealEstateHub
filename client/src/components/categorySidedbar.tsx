import { serverGetCategory } from '@/api/serverApi';
import { Category } from '@/schema/Category';

export default async function CategorySidebar() {
    const cateRes = await serverGetCategory();
    const categories = cateRes?.data || [];

    return (
        <>
            {categories.map((category: Category, index: number) => (
                <ul key={index} className={index === 0 ? '' : 'mt-3'}>
                    <h1 className="roboto-bold">{category.name}</h1>
                    {category.childCate.map((childCate, i) => (
                        <li key={i} className="py-1 text-[0.75rem]">
                            {childCate}
                        </li>
                    ))}
                </ul>
            ))}
        </>
    );
}
