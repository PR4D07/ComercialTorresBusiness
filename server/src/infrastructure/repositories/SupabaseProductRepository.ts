import { Product, ProductRepository, ProductCriteria } from "../../core/domain/Product";
import { supabase } from "../config/supabase";

export class SupabaseProductRepository implements ProductRepository {
    
    async findAll(criteria?: ProductCriteria): Promise<Product[]> {
        let query = supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `);

        if (criteria?.category) {
            // Use !inner to filter by related table
            query = supabase
                .from('products')
                .select(`
                    *,
                    categories!inner (
                        name
                    )
                `)
                .eq('categories.name', criteria.category);
        }

        if (criteria?.search) {
            const searchTerm = `%${criteria.search}%`;
            query = query.or(`name.ilike.${searchTerm},brand.ilike.${searchTerm}`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            throw new Error(error.message);
        }

        return data.map((item: any) => this.mapToDomain(item));
    }

    async findById(id: number): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories (
                    name
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            return null;
        }

        return this.mapToDomain(data);
    }

    async save(product: Product): Promise<Product> {
        // First, resolve category_id if category name is provided
        let categoryId = null;
        if (product.category) {
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('id')
                .eq('name', product.category)
                .single();
            
            if (catData) {
                categoryId = catData.id;
            } else if (catError && catError.code === 'PGRST116') { // Not found
                // Create category if not exists? Or throw?
                // For simplicity, let's create it or fail.
                // Assuming we might need to create it.
                const { data: newCat, error: createError } = await supabase
                    .from('categories')
                    .insert({ name: product.category })
                    .select()
                    .single();
                
                if (newCat) categoryId = newCat.id;
            }
        }

        const productData = {
            name: product.name,
            brand: product.brand,
            price_old: product.priceOld,
            price_new: product.priceNew,
            badge_type: product.badge?.type,
            badge_text: product.badge?.text,
            image_url: product.imageUrl,
            category_id: categoryId
        };

        if (product.id) {
            // Update
            const { data, error } = await supabase
                .from('products')
                .update(productData)
                .eq('id', product.id)
                .select(`*, categories(name)`)
                .single();
            
            if (error) throw new Error(error.message);
            return this.mapToDomain(data);
        } else {
            // Create
            const { data, error } = await supabase
                .from('products')
                .insert(productData)
                .select(`*, categories(name)`)
                .single();
            
            if (error) throw new Error(error.message);
            return this.mapToDomain(data);
        }
    }

    private mapToDomain(item: any): Product {
        return {
            id: item.id,
            name: item.name,
            brand: item.brand,
            priceOld: item.price_old,
            priceNew: item.price_new,
            badge: (item.badge_type && item.badge_text) ? {
                type: item.badge_type as 'discount' | 'new',
                text: item.badge_text
            } : undefined,
            imageUrl: item.image_url,
            category: item.categories?.name
        };
    }
}
