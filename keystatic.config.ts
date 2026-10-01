import { collection, config, fields, singleton } from '@keystatic/core';
import skillData from './src/content/skills.json';

const contentImage = {
    directory: 'src/assets/images/content',
    publicPath: '@assets/images/content/',
};

const skillOptions = skillData.skills.map((skill) => ({
    label: skill,
    value: skill,
}));

export default config({
    storage: { kind: 'local' },
    singletons: {
        skills: singleton({
            label: 'Skills Ledger',
            path: 'src/content/skills',
            format: { data: 'json' },
            schema: {
                skills: fields.array(fields.text({
                    label: 'Skill Name',
                    validation: { isRequired: true },
                }), {
                    label: 'All Skills',
                    itemLabel: (props) => props.value,
                }),
            },
        }),
    },
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
            entryLayout: 'content',
            slugField: 'title',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                period: fields.text({ label: 'Period' }),
                company: fields.text({ label: 'Company' }),
                role: fields.text({ label: 'Role' }),
                metric: fields.text({ label: 'Metric' }),
                stack: fields.multiselect({
                    label: 'Stack',
                    options: skillOptions,
                    defaultValue: [],
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
            slugField: 'name',
            format: { data: 'json' },
            schema: {
                name: fields.slug({ name: { label: 'Name' } }),
                issuer: fields.text({ label: 'Issuer' }),
                issueDate: fields.text({ label: 'Issue date' }),
                validUntil: fields.text({
                    label: 'Valid until',
                    validation: { isRequired: false },
                }),
                credentialUrl: fields.url({ label: 'Credential URL' }),
                skills: fields.multiselect({
                    label: 'Skills',
                    options: skillOptions,
                    defaultValue: [],
                }),
                order: fields.integer({ label: 'Order', defaultValue: 0 }),
            },
        }),
        experience: collection({
            label: 'Experience',
            path: 'src/content/experience/*',
            slugField: 'company',
            format: { data: 'json' },
            schema: {
                company: fields.slug({ name: { label: 'Company' } }),
                role: fields.text({ label: 'Role' }),
                period: fields.text({ label: 'Period' }),
                location: fields.text({
                    label: 'Location',
                    validation: { isRequired: false },
                }),
                focus: fields.text({ label: 'Focus', multiline: true }),
                highlights: fields.array(fields.text({
                    label: 'Highlight',
                    multiline: true,
                    validation: { isRequired: true },
                }), {
                    label: 'Highlights',
                    itemLabel: props => props.value
                }),
                stack: fields.multiselect({
                    label: 'Stack',
                    options: skillOptions,
                    defaultValue: [],
                }),
                order: fields.integer({ label: 'Order', defaultValue: 0 }),
            },
        }),
    },
});