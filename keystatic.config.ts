import { collection, config, fields } from '@keystatic/core';

const contentImage = {
    directory: 'src/assets/images/content',
    publicPath: '@assets/images/content/',
};

export default config({
    storage: { kind: 'local' },
    collections: {
        blog: collection({
            label: 'Blog',
            path: 'src/content/blog/*',
            entryLayout: 'content',
            slugField: 'title',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                pubDate: fields.date({ label: 'Publish date' }),
                updatedDate: fields.date({
                    label: 'Updated date',
                    validation: { isRequired: false },
                }),
                topic: fields.text({ label: 'Topic' }),
                readTime: fields.text({ label: 'Read time', defaultValue: '5 min' }),
                draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
                cover: fields.image({
                    label: 'Cover image',
                    ...contentImage,
                    validation: { isRequired: false },
                }),
                content: fields.markdoc({
                    label: 'Content',
                    extension: 'md',
                    options: { image: contentImage },
                }),
            },
        }),
        work: collection({
            label: 'Work',
            path: 'src/content/work/*',
            slugField: 'title',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                period: fields.text({ label: 'Period' }),
                company: fields.text({ label: 'Company' }),
                role: fields.text({ label: 'Role' }),
                metric: fields.text({ label: 'Metric' }),
                stack: fields.array(fields.text({ label: 'Technology' }), {
                    label: 'Stack',
                }),
                featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
                order: fields.integer({ label: 'Order', defaultValue: 0 }),
                cover: fields.image({
                    label: 'Cover image',
                    ...contentImage,
                    validation: { isRequired: false },
                }),
                content: fields.markdoc({
                    label: 'Content',
                    extension: 'md',
                    options: { image: contentImage },
                }),
            },
        }),
        certs: collection({
            label: 'Certifications',
            path: 'src/content/certs/*',
            slugField: 'id',
            format: { data: 'json' },
            schema: {
                id: fields.slug({ name: { label: 'Entry ID' } }),
                name: fields.text({ label: 'Name' }),
                issuer: fields.text({ label: 'Issuer' }),
                issueDate: fields.text({ label: 'Issue date' }),
                validUntil: fields.text({
                    label: 'Valid until',
                    validation: { isRequired: false },
                }),
                credentialUrl: fields.url({ label: 'Credential URL' }),
                skills: fields.array(fields.text({ label: 'Skill' }), {
                    label: 'Skills',
                }),
                order: fields.integer({ label: 'Order', defaultValue: 0 }),
            },
        }),
        experience: collection({
            label: 'Experience',
            path: 'src/content/experience/*',
            slugField: 'id',
            format: { data: 'json' },
            schema: {
                id: fields.slug({ name: { label: 'Entry ID' } }),
                period: fields.text({ label: 'Period' }),
                role: fields.text({ label: 'Role' }),
                company: fields.text({ label: 'Company' }),
                location: fields.text({
                    label: 'Location',
                    validation: { isRequired: false },
                }),
                focus: fields.text({ label: 'Focus', multiline: true }),
                stack: fields.array(fields.text({ label: 'Technology' }), {
                    label: 'Stack',
                }),
                highlights: fields.array(fields.text({ label: 'Highlight', multiline: true }), {
                    label: 'Highlights',
                }),
                order: fields.integer({ label: 'Order', defaultValue: 0 }),
            },
        }),
    },
});