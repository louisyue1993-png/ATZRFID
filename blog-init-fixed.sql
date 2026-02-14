-- 博客文章初始化脚本（修复版）
-- 部署后运行此脚本来初始化示例博客文章

-- ============================================
-- 步骤1: 检查并添加缺失的列
-- ============================================

-- 检查 read_time 列是否存在，如果不存在则添加
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'read_time'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN read_time TEXT NOT NULL DEFAULT '5 min read';
        RAISE NOTICE 'Added read_time column';
    END IF;
END $$;

-- 检查 language 列是否存在，如果不存在则添加
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts'
        AND column_name = 'language'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN language TEXT NOT NULL DEFAULT 'en';
        RAISE NOTICE 'Added language column';
    END IF;
END $$;

-- ============================================
-- 步骤2: 清理现有数据（可选）
-- ============================================

-- 如果需要重新初始化，可以取消下面的注释
-- DELETE FROM blog_posts;

-- ============================================
-- 步骤3: 插入示例博客文章
-- ============================================

-- 插入示例博客文章（使用安全的方式）
INSERT INTO blog_posts (
  slug,
  title,
  excerpt,
  content,
  category,
  author,
  read_time,
  image,
  published,
  tags,
  seo_keywords,
  language
) VALUES
(
  'future-of-rfid-technology-2025',
  'The Future of RFID Technology: Trends to Watch in 2025',
  'Explore the emerging trends and innovations that will shape the RFID industry in the coming years, from enhanced security to IoT integration.',
  'The RFID industry is evolving rapidly with new technologies and applications emerging every day. In this article, we explore the key trends that will shape the future of RFID technology in 2025.

## Enhanced Security Features
Modern RFID systems are incorporating advanced encryption and authentication mechanisms to protect sensitive data. New security protocols ensure that only authorized devices can read and write to RFID tags, making them ideal for high-security applications.

## IoT Integration
The convergence of RFID and IoT is creating new possibilities for smart tracking and real-time monitoring. RFID tags are now being equipped with sensors that can measure temperature, humidity, and other environmental factors, enabling end-to-end supply chain visibility.

## Smaller and More Powerful
Advancements in chip technology are leading to smaller, more powerful RFID tags. These miniature tags can be embedded in virtually any object, from pharmaceuticals to luxury goods, enabling new use cases and applications.

## Sustainable Materials
Eco-friendly RFID tags made from biodegradable materials are becoming increasingly popular. These tags reduce environmental impact while maintaining performance, making them ideal for sustainable packaging and product identification.',
  'Technology',
  'ATZ Team',
  '8 min read',
  '/blog/blog-1.jpg',
  true,
  '["RFID", "IoT", "Security", "Technology"]',
  '["RFID technology", "RFID trends 2025", "IoT RFID", "RFID security", "RFID innovation"]',
  'en'
),
(
  'rfid-vs-barcodes-comparison',
  'RFID vs Barcodes: A Comprehensive Comparison',
  'Understanding the key differences between RFID and barcode technologies to help you choose the right solution for your business needs.',
  'Choosing between RFID and barcode technology is a critical decision for businesses looking to implement asset tracking and identification systems. This comprehensive comparison will help you make an informed choice.

## Reading Range
- **RFID**: Can be read from several centimeters to several meters away, depending on the frequency
- **Barcodes**: Must be within line of sight and typically require close proximity (a few centimeters)

## Data Capacity
- **RFID**: Can store significantly more data (up to several kilobytes)
- **Barcodes**: Limited to a small amount of data (typically less than 100 characters)

## Simultaneous Reading
- **RFID**: Can read multiple tags simultaneously (up to hundreds per second)
- **Barcodes**: Must be scanned one at a time

## Durability
- **RFID**: Tags are resistant to dust, dirt, and moisture
- **Barcodes**: Can become unreadable if damaged or obscured

## Cost Considerations
- **RFID**: Higher initial cost but lower operational costs over time
- **Barcodes**: Lower initial cost but higher labor costs for manual scanning',
  'Technology',
  'ATZ Team',
  '6 min read',
  '/blog/blog-2.jpg',
  true,
  '["RFID", "Barcodes", "Comparison", "Technology"]',
  '["RFID vs barcodes", "RFID comparison", "barcode vs RFID", "RFID benefits", "RFID advantages"]',
  'en'
),
(
  'implementing-rfid-retail-guide',
  'Implementing RFID in Retail: A Complete Guide',
  'Learn how RFID technology is revolutionizing the retail industry with improved inventory management and enhanced customer experience.',
  'Retail businesses are increasingly adopting RFID technology to streamline operations and improve efficiency. This guide covers everything you need to know about implementing RFID in retail.

## Inventory Management
RFID enables real-time inventory tracking with 99%+ accuracy. Unlike traditional barcoding, RFID tags can be read without line of sight, allowing for rapid stock checks and inventory audits.

## Loss Prevention
RFID tags help reduce shrinkage and improve loss prevention measures. The technology can detect unauthorized item movement and trigger alerts, reducing theft and inventory loss.

## Enhanced Customer Experience
RFID-enabled smart fitting rooms allow customers to quickly find product information, check availability, and request different sizes without leaving the fitting room.

## Supply Chain Visibility
RFID provides end-to-end visibility throughout the supply chain, from manufacturing to retail stores. This enables retailers to track products at every stage and make data-driven decisions.

## Implementation Tips
1. Start with a pilot program in one department
2. Choose the right RFID frequency for your needs
3. Ensure proper tag placement on all products
4. Train staff on RFID technology and workflows
5. Monitor and analyze data for continuous improvement',
  'Retail',
  'ATZ Team',
  '10 min read',
  '/blog/blog-3.jpg',
  true,
  '["RFID", "Retail", "Inventory", "Management"]',
  '["RFID retail", "retail RFID implementation", "RFID inventory", "RFID retail solutions"]',
  'en'
),
(
  'rfid-in-healthcare-applications',
  'RFID in Healthcare: Transforming Patient Care',
  'Discover how RFID technology is improving patient safety, reducing medical errors, and streamlining healthcare operations.',
  'RFID technology is making significant impacts in healthcare, improving patient safety and operational efficiency. Here are the key applications:

## Patient Identification
RFID wristbands ensure accurate patient identification, reducing medical errors and improving patient safety. Each patient receives a unique RFID wristband containing their medical information.

## Medication Management
RFID-enabled medication dispensing systems help prevent medication errors by ensuring the right medication is given to the right patient at the right time.

## Asset Tracking
Medical equipment can be tracked in real-time using RFID, reducing equipment loss and improving utilization rates. This helps hospitals save money on replacement costs.

## Workflow Optimization
RFID streamlines healthcare workflows by automating data collection and reducing manual documentation tasks. Healthcare workers can spend more time on patient care rather than paperwork.

## Temperature Monitoring
RFID sensors monitor temperature-sensitive medications and blood products, ensuring they are stored and transported at optimal conditions.',
  'Healthcare',
  'ATZ Team',
  '7 min read',
  '/blog/blog-4.jpg',
  true,
  '["RFID", "Healthcare", "Patient Safety", "Medical"]',
  '["RFID healthcare", "RFID patient safety", "medical RFID", "RFID healthcare applications"]',
  'en'
),
(
  'rfid-supply-chain-optimization',
  'RFID for Supply Chain Optimization: A Strategic Approach',
  'Learn how leading companies use RFID to optimize their supply chains, reduce costs, and improve operational efficiency.',
  'Supply chain optimization is critical for business success, and RFID technology offers powerful tools to achieve it. Here is how leading companies are leveraging RFID:

## Real-Time Tracking
RFID provides real-time visibility into inventory location and movement, enabling proactive decision making and reducing stockouts and overstock situations.

## Automated Receiving
Goods can be automatically checked in as they arrive, reducing receiving time and improving accuracy. Multiple RFID tags can be read simultaneously, speeding up the process.

## Quality Control
RFID enables automated quality checks and traceability throughout the supply chain. Defective products can be quickly identified and recalled if necessary.

## Reduced Labor Costs
Automated RFID systems reduce the need for manual scanning and data entry, lowering labor costs and reducing human error.

## Data Analytics
RFID generates rich data that can be analyzed to identify trends, optimize processes, and make data-driven decisions about inventory management and logistics.',
  'Logistics',
  'ATZ Team',
  '9 min read',
  '/blog/blog-5.jpg',
  true,
  '["RFID", "Supply Chain", "Logistics", "Optimization"]',
  '["RFID supply chain", "RFID logistics", "supply chain optimization", "RFID tracking"]',
  'en'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 步骤4: 验证数据插入
-- ============================================

-- 显示博客文章数量和状态
SELECT
  COUNT(*) AS total_blogs,
  SUM(CASE WHEN published = true THEN 1 ELSE 0 END) AS published_blogs
FROM blog_posts;

-- 显示所有博客文章
SELECT
  id,
  slug,
  title,
  category,
  published,
  read_time,
  created_at
FROM blog_posts
ORDER BY created_at DESC;

-- ============================================
-- 完成
-- ============================================
