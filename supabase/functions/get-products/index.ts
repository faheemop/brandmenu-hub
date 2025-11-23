const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const brandReference = url.searchParams.get('brandReference');
    const pageNo = url.searchParams.get('pageNo') || '1';
    const pageSize = url.searchParams.get('pageSize') || '1000';
    const categoryId = url.searchParams.get('categoryId');
    const includeModifiers = url.searchParams.get('includeModifiers');
    const branchId = url.searchParams.get('branchId');

    if (!brandReference) {
      return new Response(
        JSON.stringify({ error: 'brandReference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build API URL
    let apiUrl = `http://51.112.221.81:8000/api/products/getAllProducts?pageNo=${pageNo}&pageSize=${pageSize}&brandReference=${brandReference}`;
    
    if (categoryId) {
      apiUrl += `&categoryId=${categoryId}`;
    }
    if (includeModifiers) {
      apiUrl += `&includeModifiers=${includeModifiers}`;
    }
    if (branchId) {
      apiUrl += `&branchId=${branchId}`;
    }

    console.log('Fetching products from:', apiUrl);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
