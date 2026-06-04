# CMS Review

## Goal

Verify that a merchant can effectively manage content assets including pages, banners, media files, and site structure through the content management system. This mission validates the complete content publishing workflow from creation through editing to publication.

## Entry Point

Merchant dashboard: `/en/merchant/dashboard` (authenticated as merchant with active store)

## Preconditions

- Merchant account exists with active store
- User is logged in with CMS permissions
- Store has at least one product and category for cross-referencing
- Mock backend has sample media files available

## Steps

1. Navigate to Pages section from sidebar
2. Observe existing pages list (Home, About, Contact)
3. Click "Create Page" button
4. Fill page creation form:
   - Title in English: "Our Story"
   - Slug: "our-story"
   - Content: Rich text with formatting
5. Switch to Arabic tab
6. Fill Arabic translation:
   - Title: "قصتنا"
   - Slug: "our-story-ar"
   - Content: Arabic text
7. Set page status to "Published"
8. Submit page creation form
9. Verify success message appears
10. Navigate back to pages list
11. Verify "Our Story" page appears in list
12. Click edit button on newly created page
13. Modify English content (add image placeholder)
14. Save changes
15. Verify update success message
16. Navigate to Banners section
17. Click "Create Banner" button
18. Fill banner form:
    - Banner name: "Summer Sale"
    - Banner type: "Hero"
    - Link URL: "/shop/summer-collection"
    - Display order: 1
19. Upload banner image (if upload available)
20. Set display dates (start and end)
21. Submit banner creation
22. Verify banner appears in active banners list
23. Navigate to Media Library
24. Observe existing media files
25. Upload new image file (if upload available)
26. Verify uploaded file appears in library
27. Click on image to view details
28. Verify image URL is accessible
29. Copy image URL to clipboard
30. Navigate back to Pages
31. Edit "Our Story" page
32. Insert copied image URL into content
33. Save and publish
34. Preview page in storefront (if preview available)
35. Verify image displays correctly

## Expected Behavior

- Pages list loads with pagination if many pages exist
- Create page form supports multilingual input with tab switching
- Rich text editor provides formatting tools (bold, italic, lists, links)
- Slug validation prevents duplicates and enforces format rules
- Page status options include Draft, Published, Scheduled
- Save action provides immediate feedback
- Edit page form pre-populates with existing content
- Changes are persisted correctly across language tabs
- Banner creation supports image upload or URL input
- Banner display order affects storefront rendering
- Date picker allows future scheduling
- Media library displays thumbnails with file details (size, format, date)
- File upload validates format and size constraints
- Uploaded files are accessible via CDN or storage URL
- Image insertion into page content generates correct HTML
- Preview function renders page with actual styling
- All forms validate input before submission
- Autosave or draft functionality prevents content loss
- Breadcrumbs show current location in CMS

## Defect Reporting Instructions

When a defect is found:
- Capture screenshot of the affected CMS section
- Capture browser console errors
- Capture network failures (especially for uploads and saves)
- Record exact reproduction steps from entry point
- Identify affected content type (page, banner, media)
- Note whether defect causes data loss
- Check if defect affects only one language or all languages
- Verify if defect reproduces in different browsers
- Propose root cause when possible (e.g., "Rich text editor strips HTML tags", "Image upload exceeds size limit without user feedback", "Multilingual save only persists default language")

## Completion Criteria

The mission is considered successful when:
- All steps complete successfully
- Expected behavior is observed at each step
- No blocking defects prevent content publishing
- Pages can be created, edited, and published in multiple languages
- Banners can be scheduled and display correctly
- Media files can be uploaded and referenced in content
- Content changes are immediately reflected in CMS
- Autosave or manual save prevents content loss
- No data corruption occurs during multilingual editing
