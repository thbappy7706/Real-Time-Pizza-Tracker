import { Head, Link, usePage } from '@inertiajs/react'
import { MapPin, Pizza, Timer, Bell, Sun, Moon, Mail, Phone, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// @ts-ignore
import { Label } from '@/components/ui/label'
import { dashboard, login, register } from '@/routes'
import type { SharedData } from '@/types'

// @ts-ignore
import { Textarea } from '@/components/ui/textarea'

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted:', formData)
        alert('Thank you for contacting us! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', phone: '', message: '' })
    }

    const faqs = [
        {
            question: 'How does live tracking work?',
            answer: 'Once your order is out for delivery, you can track the driver\'s location in real-time on the map. You\'ll see updates as they move closer to your location.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards, debit cards, and digital wallets including PayPal, Apple Pay, and Google Pay.'
        },
        {
            question: 'How long does delivery take?',
            answer: 'Typical delivery time is 30-45 minutes from order placement. You can track the exact status and estimated arrival time in your dashboard.'
        },
        {
            question: 'Can I customize my pizza?',
            answer: 'Absolutely! You can choose from a variety of toppings, crust types, and sizes. Special dietary requirements can also be accommodated.'
        },
        {
            question: 'What if there\'s an issue with my order?',
            answer: 'Contact our support team immediately through the contact section below. We\'re here 24/7 to ensure you have the best experience.'
        }
    ]

    return (
        <>
            <Head title="Pizza Tracker" />

            {/* Root */}
            <div className={`relative min-h-screen w-full overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
                {/* Background */}
                <div className="absolute inset-0 z-0 transition-all duration-500">
                    {theme === 'dark' ? (
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)',
                            }}
                        />
                    ) : (
                        <>
                            {/* Light mode gradient background */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                                }}
                            />
                            {/* Overlay for better readability */}
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />

                            {/* Animated circles */}
                            <div className="absolute top-20 left-20 w-72 h-72 bg-orange-300/30 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Navbar */}
                    <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-white/10 dark:bg-transparent">
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white transition-colors">
                            🍕 PizzaTracker
                            <Badge className="bg-orange-500 text-white shadow-lg shadow-orange-500/50">Live</Badge>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/10 transition-all"
                            >
                                {theme === 'light' ? (
                                    <Moon className="h-5 w-5" />
                                ) : (
                                    <Sun className="h-5 w-5" />
                                )}
                            </Button>

                            {auth?.user ? (
                                <Button asChild className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30">
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/10"
                                    >
                                        <Link href={login()}>Login</Link>
                                    </Button>

                                    {canRegister && (
                                        <Button asChild className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30">
                                            <Link href={register()}>Register</Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Hero */}
                    <section className="mx-auto mt-20 max-w-5xl px-6 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl transition-colors drop-shadow-sm">
                            Track Your Pizza{' '}
                            <span className="text-orange-600 dark:text-orange-500">Live</span>
                        </h1>

                        <p className="mt-6 text-lg text-gray-800 dark:text-slate-300 transition-colors font-medium">
                            Order your favorite pizza and watch it move from the oven
                            to your door in real time.
                        </p>

                        <div className="mt-8 flex justify-center gap-4">
                            <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 text-white">
                                <Link href={auth?.user ? dashboard() : register()}>
                                    Order Pizza
                                </Link>
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-gray-900/20 dark:border-white/30 text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-white/10 backdrop-blur-sm"
                            >
                                How it works
                            </Button>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-4">
                        <Feature
                            icon={<Pizza className="h-6 w-6" />}
                            title="Freshly Prepared"
                            text="Your pizza is made fresh after you place the order."
                        />
                        <Feature
                            icon={<Timer className="h-6 w-6" />}
                            title="Live Status"
                            text="Placed, baking, out for delivery — all in real time."
                        />
                        <Feature
                            icon={<MapPin className="h-6 w-6" />}
                            title="Live Tracking"
                            text="Track your delivery on the map as it comes to you."
                        />
                        <Feature
                            icon={<Bell className="h-6 w-6" />}
                            title="Instant Alerts"
                            text="Get notified instantly when status changes."
                        />
                    </section>

                    {/* FAQ Section */}
                    <section className="mx-auto mt-24 max-w-4xl px-6">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4 transition-colors">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-center text-gray-800 dark:text-slate-300 mb-12 transition-colors">
                            Got questions? We've got answers.
                        </p>

                        {/*<Accordion type="single" collapsible className="space-y-4">*/}
                        {/*    <AccordionItem*/}
                        {/*        value="item-1"*/}
                        {/*        className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-lg px-6 shadow-lg"*/}
                        {/*    >*/}
                        {/*        <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:no-underline font-semibold">*/}
                        {/*            How does live tracking work?*/}
                        {/*        </AccordionTrigger>*/}
                        {/*        <AccordionContent className="text-gray-700 dark:text-gray-400">*/}
                        {/*            Once your order is out for delivery, you can track the driver's location in real-time on the map.*/}
                        {/*            You'll see updates as they move closer to your location.*/}
                        {/*        </AccordionContent>*/}
                        {/*    </AccordionItem>*/}

                        {/*    <AccordionItem*/}
                        {/*        value="item-2"*/}
                        {/*        className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-lg px-6 shadow-lg"*/}
                        {/*    >*/}
                        {/*        <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:no-underline font-semibold">*/}
                        {/*            What payment methods do you accept?*/}
                        {/*        </AccordionTrigger>*/}
                        {/*        <AccordionContent className="text-gray-700 dark:text-gray-400">*/}
                        {/*            We accept all major credit cards, debit cards, and digital wallets including PayPal, Apple Pay, and Google Pay.*/}
                        {/*        </AccordionContent>*/}
                        {/*    </AccordionItem>*/}

                        {/*    <AccordionItem*/}
                        {/*        value="item-3"*/}
                        {/*        className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-lg px-6 shadow-lg"*/}
                        {/*    >*/}
                        {/*        <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:no-underline font-semibold">*/}
                        {/*            How long does delivery take?*/}
                        {/*        </AccordionTrigger>*/}
                        {/*        <AccordionContent className="text-gray-700 dark:text-gray-400">*/}
                        {/*            Typical delivery time is 30-45 minutes from order placement. You can track the exact status and*/}
                        {/*            estimated arrival time in your dashboard.*/}
                        {/*        </AccordionContent>*/}
                        {/*    </AccordionItem>*/}

                        {/*    <AccordionItem*/}
                        {/*        value="item-4"*/}
                        {/*        className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-lg px-6 shadow-lg"*/}
                        {/*    >*/}
                        {/*        <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:no-underline font-semibold">*/}
                        {/*            Can I customize my pizza?*/}
                        {/*        </AccordionTrigger>*/}
                        {/*        <AccordionContent className="text-gray-700 dark:text-gray-400">*/}
                        {/*            Absolutely! You can choose from a variety of toppings, crust types, and sizes. Special dietary*/}
                        {/*            requirements can also be accommodated.*/}
                        {/*        </AccordionContent>*/}
                        {/*    </AccordionItem>*/}

                        {/*    <AccordionItem*/}
                        {/*        value="item-5"*/}
                        {/*        className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-lg px-6 shadow-lg"*/}
                        {/*    >*/}
                        {/*        <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:no-underline font-semibold">*/}
                        {/*            What if there's an issue with my order?*/}
                        {/*        </AccordionTrigger>*/}
                        {/*        <AccordionContent className="text-gray-700 dark:text-gray-400">*/}
                        {/*            Contact our support team immediately through the contact form below. We're here 24/7 to ensure*/}
                        {/*            you have the best experience.*/}
                        {/*        </AccordionContent>*/}
                        {/*    </AccordionItem>*/}
                        {/*</Accordion>*/}
                    </section>

                    {/* Contact Section */}
                    <section className="mx-auto mt-24 max-w-6xl px-6">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4 transition-colors">
                            Get in Touch
                        </h2>
                        <p className="text-center text-gray-800 dark:text-slate-300 mb-12 transition-colors">
                            Have questions or need support? We're here to help!
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Contact Info Cards */}
                            <div className="space-y-6">
                                <Card className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl">
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="rounded-full p-3 bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                Email Us
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                                We'll respond within 24 hours
                                            </p>
                                            <a
                                                href="mailto:support@pizzatracker.com"
                                                className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                                            >
                                                support@pizzatracker.com
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl">
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="rounded-full p-3 bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                Call Us
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                                Available 24/7 for support
                                            </p>
                                            <a
                                                href="tel:1-800-742-9266"
                                                className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                                            >
                                                1-800-PIZZA-NOW
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl">
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="rounded-full p-3 bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                            <MessageCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                                Live Chat
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                                                Instant support via chat
                                            </p>
                                            <button className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                                                Start chatting now →
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Form */}
                            <Card className="border border-gray-900/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl">
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">
                                                Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Your full name"
                                                required
                                                className="bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your.email@example.com"
                                                required
                                                className="bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-gray-900 dark:text-gray-100">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+1 (555) 000-0000"
                                                className="bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-gray-900 dark:text-gray-100">
                                                Message *
                                            </Label>
                                            {/*<Textarea*/}
                                            {/*    id="message"*/}
                                            {/*    name="message"*/}
                                            {/*    value={formData.message}*/}
                                            {/*    onChange={handleInputChange}*/}
                                            {/*    placeholder="How can we help you?"*/}
                                            {/*    required*/}
                                            {/*    rows={5}*/}
                                            {/*    className="bg-white/50 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"*/}
                                            {/*/>*/}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30"
                                        >
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="mt-32 pb-10 text-center text-sm text-gray-700 dark:text-slate-400 transition-colors">
                        © {new Date().getFullYear()} PizzaTracker. Built with Laravel & Reverb.
                    </footer>
                </div>
            </div>
        </>
    )
}

function Feature({
                     icon,
                     title,
                     text,
                 }: {
    icon: React.ReactNode
    title: string
    text: string
}) {
    return (
        <Card
            className="
                border border-gray-900/10 dark:border-none
                bg-white/80 backdrop-blur-xl shadow-xl
                transition-all hover:shadow-2xl hover:scale-105
                dark:bg-neutral-900/80
                dark:shadow-black/40
            "
        >
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div
                    className="
                        rounded-full p-3
                        bg-orange-100 text-orange-600
                        dark:bg-orange-500/10 dark:text-orange-400
                    "
                >
                    {icon}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>

                <p className="text-sm text-gray-700 dark:text-gray-400">
                    {text}
                </p>
            </CardContent>
        </Card>
    )
}
